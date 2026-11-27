import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paper, Pill } from '../../components/Tactile';
import { Txt } from '../../components/Txt';
import { bn, GREG_MONTHS, GREG_MONTHS_MY, MAX_YEAR, MIN_YEAR, parseKey, yearHolidays } from '../../lib/calendar';
import { OFFICIAL_NOTES } from '../../lib/holidays';
import { t } from '../../lib/i18n';
import { useSettings } from '../../lib/settings';
import { C } from '../../lib/theme';

export default function HolidaysScreen() {
  const { lang } = useSettings();
  const my = lang === 'my';
  const { width } = useWindowDimensions();
  const now = new Date();
  const [year, setYear] = useState(Math.max(MIN_YEAR, Math.min(MAX_YEAR, now.getFullYear() + (now.getMonth() >= 10 ? 1 : 0))));
  const rows = yearHolidays(year);
  const official = rows.length > 0 && rows[0].official;
  const note = OFFICIAL_NOTES[year];

  const fmt = (k: string) => {
    const { m, d } = parseKey(k);
    return my ? `${GREG_MONTHS_MY[m - 1]} ${bn(d)}` : `${GREG_MONTHS[m - 1].slice(0, 3)} ${d}`;
  };
  const range = (a: string, b?: string) => {
    if (!b) return fmt(a);
    const d = parseKey(b).d;
    return parseKey(a).m === parseKey(b).m ? `${fmt(a)}–${my ? bn(d) : d}` : `${fmt(a)}–${fmt(b)}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.backdrop }} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingVertical: 12, paddingBottom: 28 }}>
        <Paper style={{ width: Math.min(width - 20, 540), alignSelf: 'center' }}>
          <View style={{ padding: 18 }}>
            <View style={st.head}>
              <View style={{ flex: 1 }}>
                <Txt size={13}>ရုံးပိတ်ရက်များ</Txt>
                <Txt size={9.5} caps weight="medium" color={C.soft}>Public holidays</Txt>
              </View>
              <Pill label="‹" onPress={() => setYear((y) => Math.max(MIN_YEAR, y - 1))} accessibilityLabel="Previous year" />
              <Pill label="›" onPress={() => setYear((y) => Math.min(MAX_YEAR, y + 1))} accessibilityLabel="Next year" />
            </View>
            <Txt size={74} weight="light" style={{ lineHeight: 78, letterSpacing: -4, marginLeft: -3, marginTop: 6 }}>{year}</Txt>
            <Txt size={10} caps weight="medium" color={official ? C.red : C.soft} style={{ marginBottom: 10 }}>
              {official ? 'Union Government · State Gazette' : 'Calculated · check the official list'}
            </Txt>
            {rows.length === 0 ? <Txt color={C.soft}>{t(lang, 'noHolidays')}</Txt> : null}
            {rows.map((r) => (
              <Pressable key={r.key + r.en} onPress={() => router.push(`/day/${r.key}`)} style={({ pressed }) => [st.row, pressed && { opacity: 0.6 }]}>
                <Txt size={12} weight="medium" color={C.red} style={{ width: my ? 112 : 96 }}>{range(r.key, r.to)}</Txt>
                <View style={{ flex: 1 }}>
                  <Txt size={14}>{r.my}</Txt>
                  <Txt size={9.5} caps color={C.soft}>{r.en}</Txt>
                </View>
              </Pressable>
            ))}
            {note ? <Txt size={10.5} color={C.soft} style={{ marginTop: 14 }}>{note[lang]}</Txt> : null}
          </View>
        </Paper>
      </ScrollView>
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderTopWidth: 2 * StyleSheet.hairlineWidth, borderTopColor: C.line, gap: 8 },
});
