import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayDetail } from '../../components/DayDetail';
import { Txt } from '../../components/Txt';
import { bn, burmeseDateLine, dayInfo, parseKey, todayKey, upcomingSabbaths } from '../../lib/calendar';
import { t } from '../../lib/i18n';
import { useSettings } from '../../lib/settings';
import { C } from '../../lib/theme';

export default function TodayScreen() {
  const { lang } = useSettings();
  const [key, setKey] = useState(todayKey());
  // Refresh when the tab comes back into view (e.g. the next morning).
  useFocusEffect(useCallback(() => setKey(todayKey()), []));
  const { y, m, d } = parseKey(key);
  const info = dayInfo(y, m, d);
  const next = upcomingSabbaths(key, 2).find((s) => s.key !== key);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.paper }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <Txt size={13} bold color={C.soft}>{t(lang, 'today').toUpperCase()}</Txt>
        <DayDetail d={info} lang={lang} />
        {next ? (
          <Txt size={13} color={C.soft} style={{ marginTop: 14 }}>
            {lang === 'my' ? 'နောက် ဥပုသ်နေ့ — ' : 'Next Sabbath — '}
            {`${lang === 'my' ? bn(`${next.d}.${next.m}.${next.y}`) : `${next.d}/${next.m}/${next.y}`} · ${burmeseDateLine(next)}`}
          </Txt>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
