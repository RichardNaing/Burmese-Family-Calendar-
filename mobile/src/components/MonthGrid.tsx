import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { bn, type DayInfo, type MonthData, WEEKDAYS_SHORT_EN, WEEKDAYS_SHORT_MY } from '../lib/calendar';
import type { Lang } from '../lib/i18n';
import { C } from '../lib/theme';
import { Txt } from './Txt';

interface Props {
  data: MonthData;
  lang: Lang;
  today: string;
  onPress: (d: DayInfo) => void;
}

export const MonthGrid = memo(function MonthGrid({ data, lang, today, onPress }: Props) {
  const cells: (DayInfo | null)[] = [...Array(data.lead).fill(null), ...data.days];
  while (cells.length % 7) cells.push(null);
  const weeks: (DayInfo | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const heads = lang === 'my' ? WEEKDAYS_SHORT_MY : WEEKDAYS_SHORT_EN;

  return (
    <View>
      <View style={st.week}>
        {heads.map((h, i) => (
          <View key={i} style={st.head}>
            <Txt size={lang === 'my' ? 10 : 12} color={i === 0 || i === 6 ? C.red : C.soft} bold>
              {h}
            </Txt>
          </View>
        ))}
      </View>
      {weeks.map((w, wi) => (
        <View key={wi} style={st.week}>
          {w.map((d, di) => (d ? <Cell key={d.key} d={d} isToday={d.key === today} onPress={onPress} /> : <View key={di} style={st.cell} />))}
        </View>
      ))}
    </View>
  );
});

function Cell({ d, isToday, onPress }: { d: DayInfo; isToday: boolean; onPress: (d: DayInfo) => void }) {
  const hol = d.holidays.length > 0;
  const numColor = isToday ? C.paper : hol ? C.red : C.ink;
  const label = `${d.d}${hol ? ', ' + d.holidays[0].en : ''}${d.sabbath ? ', Sabbath' : ''}`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => onPress(d)}
      style={({ pressed }) => [st.cell, pressed && { opacity: 0.6 }]}
    >
      <View style={[st.num, hol && !isToday && st.holBg, isToday && st.todayBg]}>
        <Txt size={17} bold color={numColor}>
          {d.d}
        </Txt>
      </View>
      <View style={st.lunar}>
        {d.phase === 1 ? (
          <View style={[st.moon, { backgroundColor: C.red }]} />
        ) : d.phase === 3 ? (
          <View style={[st.moon, { backgroundColor: C.ink }]} />
        ) : (
          <Txt size={10} color={C.faint}>
            {bn(d.fortnightDay)}
          </Txt>
        )}
        {d.sabbath && d.phase !== 1 && d.phase !== 3 ? <View style={st.sab} /> : null}
      </View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  week: { flexDirection: 'row' },
  head: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  cell: { flex: 1, alignItems: 'center', paddingVertical: 4, minHeight: 58 },
  num: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  holBg: { backgroundColor: C.redSoft },
  todayBg: { backgroundColor: C.today },
  lunar: { flexDirection: 'row', alignItems: 'center', height: 18, gap: 3 },
  moon: { width: 9, height: 9, borderRadius: 5 },
  sab: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.gold },
});
