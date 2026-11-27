import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayDetail } from '../../components/DayDetail';
import { Pill } from '../../components/Tactile';
import { Txt } from '../../components/Txt';
import { dayInfo, MAX_YEAR, MIN_YEAR, parseKey } from '../../lib/calendar';
import { t } from '../../lib/i18n';
import { useSettings } from '../../lib/settings';
import { C } from '../../lib/theme';

export default function DayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { lang } = useSettings();
  const { width } = useWindowDimensions();
  const { y, m, d } = parseKey(String(date ?? ''));
  const valid = y >= MIN_YEAR && y <= MAX_YEAR && m >= 1 && m <= 12 && d >= 1 && d <= new Date(y, m, 0).getDate();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.backdrop }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 12, paddingTop: 8 }}>
        <Pill label={t(lang, 'close')} onPress={close} />
      </View>
      <ScrollView contentContainerStyle={{ paddingVertical: 12, paddingBottom: 32, alignItems: 'center' }}>
        <View style={{ width: Math.min(width - 20, 540) }}>
          {valid ? <DayDetail d={dayInfo(y, m, d)} lang={lang} /> : <Txt color={C.soft}>—</Txt>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
