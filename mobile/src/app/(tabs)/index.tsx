import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type GestureResponderEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MonthGrid } from '../../components/MonthGrid';
import { Txt } from '../../components/Txt';
import { bn, type DayInfo, GREG_MONTHS, GREG_MONTHS_MY, MAX_YEAR, MIN_YEAR, monthData, parseKey, todayKey, yearHolidays } from '../../lib/calendar';
import { t } from '../../lib/i18n';
import { useSettings } from '../../lib/settings';
import { C } from '../../lib/theme';

export default function CalendarScreen() {
  const { lang } = useSettings();
  const my = lang === 'my';
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() + 1 });
  const today = todayKey();
  const data = monthData(ym.y, ym.m);

  const step = (delta: number) => {
    setYm(({ y, m }) => {
      let nm = m + delta, ny = y;
      if (nm < 1) { nm = 12; ny--; }
      if (nm > 12) { nm = 1; ny++; }
      if (ny < MIN_YEAR || ny > MAX_YEAR) return { y, m };
      return { y: ny, m: nm };
    });
  };

  const startX = useRef(0);
  const onTouchStart = (e: GestureResponderEvent) => { startX.current = e.nativeEvent.pageX; };
  const onTouchEnd = (e: GestureResponderEvent) => {
    const dx = e.nativeEvent.pageX - startX.current;
    if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
  };

  const open = (d: DayInfo) => router.push(`/day/${d.key}`);
  const isCurrent = ym.y === now.getFullYear() && ym.m === now.getMonth() + 1;
  const pre = `${ym.y}-${String(ym.m).padStart(2, '0')}`;
  const monthHols = yearHolidays(ym.y).filter((h) => h.key.startsWith(pre) || (h.to ?? '').startsWith(pre));
  const dayNum = (k: string) => (my ? bn(parseKey(k).d) : String(parseKey(k).d));
  const span = (a: string, b?: string) => {
    const from = a.startsWith(pre) ? dayNum(a) : '';
    const to = b && b.startsWith(pre) ? dayNum(b) : '';
    if (!b) return from;
    return `${from}–${to}`;
  };

  return (
    <SafeAreaView style={st.safe} edges={['top']}>
      <ScrollView contentContainerStyle={st.pad}>
        <View style={st.header}>
          <View style={{ flex: 1 }}>
            <Txt size={13} color={C.soft} bold>{my ? bn(ym.y) : ym.y}</Txt>
            <Txt size={28} bold>{my ? GREG_MONTHS_MY[ym.m - 1] : GREG_MONTHS[ym.m - 1]}</Txt>
          </View>
          {!isCurrent ? (
            <Pressable onPress={() => setYm({ y: now.getFullYear(), m: now.getMonth() + 1 })} style={st.todayBtn} accessibilityRole="button">
              <Txt size={13} bold color={C.red}>{t(lang, 'goToday')}</Txt>
            </Pressable>
          ) : null}
          <Pressable onPress={() => step(-1)} style={st.arrow} accessibilityLabel="Previous month" hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color={C.ink} />
          </Pressable>
          <Pressable onPress={() => step(1)} style={st.arrow} accessibilityLabel="Next month" hitSlop={8}>
            <Ionicons name="chevron-forward" size={22} color={C.ink} />
          </Pressable>
        </View>
        <Txt size={14} color={C.red} style={{ marginBottom: 8 }}>
          {`${data.myYears} · ${data.myMonths.join(' – ')}`}
        </Txt>

        <View style={st.card} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <MonthGrid data={data} lang={lang} today={today} onPress={open} />
        </View>

        <View style={st.legend}>
          <Legend dot={C.red} label={t(lang, 'fullMoon')} />
          <Legend dot={C.ink} label={t(lang, 'newMoon')} />
          <Legend dot={C.gold} small label={t(lang, 'sabbath')} />
          <Legend box label={t(lang, 'holiday')} />
        </View>

        {monthHols.length ? (
          <View style={[st.card, { paddingVertical: 6 }]}>
            {monthHols.map((h) => (
              <Pressable key={h.key + h.en} onPress={() => router.push(`/day/${h.key}`)} style={st.holRow}>
                <Txt size={15} bold color={C.red} style={{ width: 64 }}>{span(h.key, h.to)}</Txt>
                <View style={{ flex: 1 }}>
                  <Txt size={15}>{h.my}</Txt>
                  <Txt size={12} color={C.soft}>{h.en}</Txt>
                </View>
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Legend({ dot, label, small, box }: { dot?: string; label: string; small?: boolean; box?: boolean }) {
  return (
    <View style={st.legendItem}>
      {box ? (
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.redSoft, borderWidth: 1, borderColor: C.red }} />
      ) : (
        <View style={{ width: small ? 6 : 10, height: small ? 6 : 10, borderRadius: 5, backgroundColor: dot }} />
      )}
      <Txt size={12} color={C.soft}>{label}</Txt>
    </View>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper },
  pad: { padding: 16, paddingBottom: 32, gap: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  arrow: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  todayBtn: { paddingHorizontal: 12, height: 32, borderRadius: 16, justifyContent: 'center', borderWidth: 1, borderColor: C.red, marginRight: 4 },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, marginTop: 4 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingVertical: 10, paddingHorizontal: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  holRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
});
