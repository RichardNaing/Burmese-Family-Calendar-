import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayDetail } from '../../components/DayDetail';
import { Txt } from '../../components/Txt';
import { dayInfo, MAX_YEAR, MIN_YEAR, parseKey } from '../../lib/calendar';
import { t } from '../../lib/i18n';
import { useSettings } from '../../lib/settings';
import { C } from '../../lib/theme';

export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { lang } = useSettings();
  const { y, m, d } = parseKey(String(date ?? ''));
  const valid = y >= MIN_YEAR && y <= MAX_YEAR && m >= 1 && m <= 12 && d >= 1 && d <= new Date(y, m, 0).getDate();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.paper }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 8 }}>
        <Pressable onPress={close} hitSlop={10} accessibilityRole="button">
          <Txt size={15} bold color={C.red}>{t(lang, 'close')}</Txt>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {valid ? <DayDetail d={dayInfo(y, m, d)} lang={lang} /> : <Txt color={C.soft}>—</Txt>}
      </ScrollView>
    </SafeAreaView>
  );
}
