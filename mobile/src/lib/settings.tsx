import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from './i18n';
import { cancelReminders, requestPermission, scheduleReminders } from './reminders';

interface Settings {
  lang: Lang;
  reminders: boolean;
}
interface Ctx extends Settings {
  ready: boolean;
  setLang: (l: Lang) => void;
  /** returns false when the user declined notification permission */
  setReminders: (on: boolean) => Promise<boolean>;
}

const KEY = 'settings.v1';
const DEFAULTS: Settings = { lang: 'my', reminders: false };
const SettingsCtx = createContext<Ctx | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setS({ ...DEFAULTS, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const save = useCallback((next: Settings) => {
    setS(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  // Keep the reminder queue topped up each launch (it only holds ~40 days).
  useEffect(() => {
    if (ready && s.reminders) scheduleReminders(s.lang).catch(() => {});
  }, [ready, s.reminders, s.lang]);

  const value = useMemo<Ctx>(
    () => ({
      ...s,
      ready,
      setLang: (lang) => save({ ...s, lang }),
      setReminders: async (on) => {
        if (on) {
          const ok = await requestPermission();
          if (!ok) return false;
        } else {
          await cancelReminders();
        }
        save({ ...s, reminders: on });
        return true;
      },
    }),
    [s, ready, save],
  );

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export function useSettings(): Ctx {
  const c = useContext(SettingsCtx);
  if (!c) throw new Error('useSettings outside SettingsProvider');
  return c;
}
