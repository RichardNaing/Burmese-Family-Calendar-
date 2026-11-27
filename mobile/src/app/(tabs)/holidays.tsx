import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Txt } from '../../components/Txt';
import { bn, GREG_MONTHS, GREG_MONTHS_MY, MAX_YEAR, MIN_YEAR, parseKey, yearHolidays } from '../../lib/calendar';
import { OFFICIAL_NOTES } from '../../lib/holidays';
import { t } from '../../lib/i18n';
import { useSettings } from '../../lib/settings';
import { C } from '../../lib/theme';

export default function HolidaysScreen() {
  const { lang } = useSettings();
  const my = lang === 'my';
  const [year, setYear] = useState(Math.max(MIN_YEAR, Math.min(MAX_YEAR, new Date().getFullYear() + (new Date().getMonth() >= 10 ? 1 : 0))));
  const rows = useMemo(() => yearHolidays(year), [year]);
  const official = rows.length > 0 && rows[0].official;
  const note = OFFICIAL_NOTES[year];

  const fmt = (k: string) => {
    const { m, d } = parseKey(k);
    return my ? `${GREG_MONTHS_MY[m - 1]} ${bn(d)}` : `${GREG_MONTHS[m - 1].slice(0, 3)} ${d}`;
  };
  const range = (a: string, b?: string) => {
    if (!b) return fmt(a);
    const { d } = parseKey(b);
    return parseKey(a).m === parseKey(b).m ? `${fmt(a)}–${my ? bn(d) : d}` : `${fmt(a)} – ${fmt(b)}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.paper }} edges={['top']}>
      <View style={st.header}>
        <Pressable onPress={() => setYear((y) => Math.max(MIN_YEAR, y - 1))} style={st.arrow} accessibilityLabel="Previous year">
          <Ionicons name="chevron-back" size={22} color={C.ink} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Txt size={13} bold color={C.soft}>{t(lang, 'holidays').toUpperCase()}</Txt>
          <Txt size={26} bold>{my ? bn(year) : year}</Txt>
        </View>
        <Pressable onPress={() => setYear((y) => Math.min(MAX_YEAR, y + 1))} style={st.arrow} accessibilityLabel="Next year">
          <Ionicons name="chevron-forward" size={22} color={C.ink} />
        </Pressable>
      </View>
      <View style={[st.badge, { borderColor: official ? C.red : C.faint }]}>
        <Txt size={12} bold color={official ? C.red : C.soft}>{t(lang, official ? 'official' : 'calculated')}</Txt>
      </View>
      <FlatList
        data={rows}
        keyExtractor={(r) => r.key + r.en}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        ListEmptyComponent={<Txt color={C.soft}>{t(lang, 'noHolidays')}</Txt>}
        ListFooterComponent={note ? <Txt size={12} color={C.soft} style={{ marginTop: 12 }}>{note[lang]}</Txt> : undefined}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/day/${item.key}`)} style={st.row}>
            <Txt size={14} bold color={C.red} style={{ width: my ? 118 : 92 }}>{range(item.key, item.to)}</Txt>
            <View style={{ flex: 1 }}>
              <Txt size={15}>{item.my}</Txt>
              <Txt size={12} color={C.soft}>{item.en}</Txt>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  arrow: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  badge: { alignSelf: 'center', borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 2, marginTop: 8, marginHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line, gap: 8 },
});
