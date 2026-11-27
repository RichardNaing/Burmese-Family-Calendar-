import { router, useFocusEffect } from 'expo-router';
import { type ReactNode, useCallback, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Paper, Pill, Tag } from '../../components/Tactile';
import { TactileBoard } from '../../components/TactileBoard';
import { Txt } from '../../components/Txt';
import {
  bn, burmeseDateLine, dateKey, dayInfo, GREG_MONTHS, GREG_MONTHS_MY, MAX_YEAR, MIN_YEAR, monthData, parseKey,
  PHASES_EN, PHASES_MY, todayKey, WEEKDAYS_EN, WEEKDAYS_MY,
} from '../../lib/calendar';
import { t } from '../../lib/i18n';
import { useSettings } from '../../lib/settings';
import { C } from '../../lib/theme';

const MAX_BOARD = 540;

export default function CalendarScreen() {
  const { lang } = useSettings();
  const my = lang === 'my';
  const { width } = useWindowDimensions();
  const [today, setToday] = useState(todayKey());
  const [selected, setSelected] = useState(today);
  const [scroll, setScroll] = useState(true);
  useFocusEffect(useCallback(() => setToday(todayKey()), []));

  const sel = parseKey(selected);
  const data = monthData(sel.y, sel.m);
  const info = dayInfo(sel.y, sel.m, sel.d);

  const boardW = Math.min(width - 20, MAX_BOARD);
  const pad = 16;

  const goMonth = (delta: number) => {
    let m = sel.m + delta, y = sel.y;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    if (y < MIN_YEAR || y > MAX_YEAR) return;
    const tk = parseKey(today);
    const d = tk.y === y && tk.m === m ? tk.d : 1;
    setSelected(dateKey(y, m, d));
  };

  const tags: { text: string; color?: string }[] = [];
  tags.push({ text: `${PHASES_MY[info.phase]} · ${PHASES_EN[info.phase]}${info.phase === 0 || info.phase === 2 ? ' ' + info.fortnightDay : ''}` });
  if (info.sabbath) tags.push({ text: 'ဥပုသ်နေ့ · Sabbath', color: C.goldText });
  if (info.sabbathEve) tags.push({ text: 'အဖိတ်နေ့ · Sabbath eve', color: C.goldText });
  info.holidays.forEach((h) => tags.push({ text: `${h.my} · ${h.en}`, color: C.red }));
  if (info.yatyaza) tags.push({ text: 'ရက်ရာဇာ · Yatyaza' });
  if (info.pyathada) tags.push({ text: `${info.pyathada === 2 ? 'မွန်းလွဲ ' : ''}ပြဿဒါး · Pyathada` });

  const enLine = [
    `${GREG_MONTHS[sel.m - 1]} ${sel.d}, ${sel.y}`,
    `${PHASES_EN[info.phase]}${info.phase === 0 || info.phase === 2 ? ' ' + info.fortnightDay : ''}`,
    `ME ${info.my}`,
    `Sasana ${info.my + 1182}`,
    `Naga ${info.nagahleEn}`,
  ].join(' · ');

  return (
    <SafeAreaView style={st.safe} edges={['top']}>
      <ScrollView contentContainerStyle={st.scroll} scrollEnabled={scroll}>
        <Paper style={{ width: boardW, alignSelf: 'center' }}>
          <View style={{ padding: pad, paddingTop: 18 }}>
            <View style={st.headTop}>
              <Txt size={11.5} color={C.soft} style={{ flex: 1 }}>{`${data.myYears} · ${data.myMonths.join(' – ')}`}</Txt>
              <View style={st.nav}>
                <Pill label="‹" onPress={() => goMonth(-1)} accessibilityLabel="Previous month" />
                <Pill label={my ? 'ယနေ့' : 'Today'} onPress={() => setSelected(today)} accessibilityLabel="Today" />
                <Pill label="›" onPress={() => goMonth(1)} accessibilityLabel="Next month" />
              </View>
            </View>
            <View style={st.caption}>
              <Txt size={74} weight="light" style={{ lineHeight: 74, letterSpacing: -4, marginLeft: -3, minWidth: 60 }}>{sel.d}</Txt>
              <View style={{ flex: 1, paddingBottom: 2, marginLeft: 10 }}>
                <Txt size={17} style={{ letterSpacing: -0.4 }}>{WEEKDAYS_EN[info.weekday]}</Txt>
                <Txt size={13}>{burmeseDateLine(info)}</Txt>
              </View>
            </View>
            <View style={st.monthRow}>
              <Txt size={17} color={C.soft} style={{ letterSpacing: -0.4 }}>{`${GREG_MONTHS[sel.m - 1]} ${sel.y}`}</Txt>
              <Txt size={12} color={C.soft}>{`${GREG_MONTHS_MY[sel.m - 1]} ${bn(sel.y)}`}</Txt>
            </View>

            <TactileBoard
              data={data}
              width={boardW - pad * 2}
              selected={selected}
              today={today}
              onSelect={setSelected}
              onHold={(h) => setScroll(!h)}
            />

            <View style={st.info}>
              <Txt size={15}>{`${WEEKDAYS_MY[info.weekday]}နေ့ · ${burmeseDateLine(info)}`}</Txt>
              <Txt size={9.5} caps color={C.soft} style={{ marginTop: 2 }}>{enLine}</Txt>
              <View style={st.tags}>
                {tags.map((tg, i) => <Tag key={i} color={tg.color}>{tg.text}</Tag>)}
              </View>
              <View style={{ flexDirection: 'row', marginTop: 14 }}>
                <Pill label={my ? 'အသေးစိတ် ›' : 'Details ›'} onPress={() => router.push(`/day/${selected}`)} />
              </View>
            </View>

            <View style={st.legend}>
              <Legend shape={<View style={[st.dot, { backgroundColor: C.red }]} />} label={t(lang, 'fullMoon')} />
              <Legend shape={<View style={[st.dot, { backgroundColor: C.ink }]} />} label={t(lang, 'newMoon')} />
              <Legend shape={<View style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: C.red }} />} label={t(lang, 'holiday')} />
              <Legend shape={<View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: C.gold }} />} label={t(lang, 'sabbath')} />
            </View>
          </View>
        </Paper>
        <Txt size={10} color="#6F6C66" style={st.hint}>Drag or flick the ball into a day · tap a day</Txt>
        <Txt size={11} color="#6F6C66" style={[st.hint, { marginTop: 0 }]}>ဘောလုံးကို ရက်တစ်ရက်ထဲ ဆွဲချပါ</Txt>
      </ScrollView>
    </SafeAreaView>
  );
}

function Legend({ shape, label }: { shape: ReactNode; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      {shape}
      <Txt size={9} caps weight="medium" color={C.soft}>{label}</Txt>
    </View>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.backdrop },
  scroll: { paddingVertical: 12, paddingBottom: 28 },
  headTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  nav: { flexDirection: 'row', gap: 6 },
  caption: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, marginBottom: 10 },
  info: { paddingTop: 14, minHeight: 120 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  hint: { textAlign: 'center', marginTop: 12 },
});
