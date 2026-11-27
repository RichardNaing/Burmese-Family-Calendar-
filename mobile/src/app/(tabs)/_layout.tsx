import Ionicons from '@expo/vector-icons/Ionicons';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router/js-tabs';
import { t } from '../../lib/i18n';
import { useSettings } from '../../lib/settings';
import { C, F } from '../../lib/theme';

type IconName = keyof typeof Ionicons.glyphMap;
function TabIcon({ name, color, size }: { name: IconName; color: ColorValue; size: number }) {
  return <Ionicons name={name} color={color as string} size={size} />;
}

export default function TabsLayout() {
  const { lang } = useSettings();
  const insets = useSafeAreaInsets();
  const labelStyle = lang === 'my' ? { fontFamily: F.my, fontSize: 10, lineHeight: 20 } : { fontFamily: F.monoMedium, fontSize: 9.5, letterSpacing: 0.6, textTransform: 'uppercase' as const };
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.ink,
        tabBarInactiveTintColor: C.soft,
        tabBarStyle: { backgroundColor: C.paper, borderTopColor: C.line, height: 68 + insets.bottom, paddingBottom: insets.bottom + 6 },
        tabBarItemStyle: { paddingTop: 4 },
        tabBarLabelStyle: labelStyle,
        sceneStyle: { backgroundColor: C.backdrop },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t(lang, 'calendar'), tabBarIcon: (p) => <TabIcon name="calendar-outline" {...p} /> }} />
      <Tabs.Screen name="holidays" options={{ title: t(lang, 'holidays'), tabBarIcon: (p) => <TabIcon name="flag-outline" {...p} /> }} />
      <Tabs.Screen name="settings" options={{ title: t(lang, 'settings'), tabBarIcon: (p) => <TabIcon name="settings-outline" {...p} /> }} />
    </Tabs>
  );
}
