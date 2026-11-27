import { Image, StyleSheet, View } from 'react-native';
import {
  bn, burmeseDateLine, type DayInfo, englishDateLine, GREG_MONTHS, GREG_MONTHS_MY, PHASES_EN, PHASES_MY,
  WEEKDAYS_EN, WEEKDAYS_MY,
} from '../lib/calendar';
import { type Lang, t } from '../lib/i18n';
import { C } from '../lib/theme';
import { Paper, Tag } from './Tactile';
import { Txt } from './Txt';

const BALL = require('../../assets/tactile/ball.png');
const DIMPLE = require('../../assets/tactile/dimple.png');

export function DayDetail({ d, lang }: { d: DayInfo; lang: Lang }) {
  const my = lang === 'my';
  return (
    <Paper>
      <View style={{ padding: 20 }}>
        <View style={st.hero}>
          <Txt size={84} weight="light" style={{ lineHeight: 84, letterSpacing: -5, marginLeft: -4 }}>{d.d}</Txt>
          <View style={{ flex: 1, marginLeft: 12, paddingBottom: 4 }}>
            <Txt size={17} style={{ letterSpacing: -0.4 }}>{WEEKDAYS_EN[d.weekday]}</Txt>
            <Txt size={13} color={C.soft}>{`${GREG_MONTHS[d.m - 1]} ${d.y}`}</Txt>
          </View>
          <View style={st.dimpleWrap}>
            <Image source={DIMPLE} style={st.dimple} />
            <Image source={BALL} style={st.ball} />
          </View>
        </View>

        <View style={st.rule} />
        <Txt size={17}>{`${WEEKDAYS_MY[d.weekday]}နေ့ · ${burmeseDateLine(d)}`}</Txt>
        <Txt size={10} caps color={C.soft}>{`${GREG_MONTHS_MY[d.m - 1]} ${bn(d.d)}၊ ${bn(d.y)}`}</Txt>
        <Txt size={10} caps color={C.soft} style={{ marginTop: 2 }}>{englishDateLine(d)}</Txt>

        <View style={st.tags}>
          <Tag color={d.phase === 1 ? C.red : C.ink}>{`${PHASES_MY[d.phase]} · ${PHASES_EN[d.phase]}`}</Tag>
          {d.sabbath ? <Tag color={C.goldText}>ဥပုသ်နေ့ · Sabbath</Tag> : null}
          {d.sabbathEve ? <Tag color={C.goldText}>အဖိတ်နေ့ · Sabbath eve</Tag> : null}
        </View>

        {d.holidays.length > 0 ? (
          <View style={{ marginTop: 18 }}>
            <Txt size={9.5} caps weight="medium" color={C.red}>{my ? 'ရုံးပိတ်ရက်' : 'Public holiday'}</Txt>
            {d.holidays.map((h, i) => (
              <View key={i} style={{ marginTop: 4 }}>
                <Txt size={17} color={C.red}>{h.my}</Txt>
                <Txt size={11} caps color={C.soft}>{h.en}</Txt>
              </View>
            ))}
            {!d.holidays[0].official ? <Txt size={10.5} color={C.soft} style={{ marginTop: 6 }}>{t(lang, 'calculated')}</Txt> : null}
          </View>
        ) : null}

        <View style={{ marginTop: 18 }}>
          <Row my="ရက်ရာဇာ" en="Yatyaza" value={d.yatyaza ? '●' : '—'} color={d.yatyaza ? C.gold : C.soft} />
          <Row my="ပြဿဒါး" en="Pyathada" value={d.pyathada === 1 ? '●' : d.pyathada === 2 ? (my ? 'မွန်းလွဲ' : 'Afternoon') : '—'} color={d.pyathada ? C.red : C.soft} />
          <Row my="နဂါးခေါင်းလှည့်" en="Naga head" value={my ? d.nagahleMy : d.nagahleEn} />
          <Row my="မဟာဘုတ်" en="Mahabote" value={my ? d.mahaboteMy : d.mahaboteEn} />
          {d.astroEn.length ? <Row my="နေ့ထူးများ" en="Special days" value={(my ? d.astroMy : d.astroEn).join(', ')} /> : null}
        </View>
      </View>
    </Paper>
  );
}

function Row({ my, en, value, color = C.ink }: { my: string; en: string; value: string; color?: string }) {
  return (
    <View style={st.row}>
      <View style={{ flex: 1 }}>
        <Txt size={13}>{my}</Txt>
        <Txt size={9} caps color={C.soft}>{en}</Txt>
      </View>
      <Txt size={13} weight="medium" color={color} style={{ flexShrink: 1, textAlign: 'right' }}>{value}</Txt>
    </View>
  );
}

const st = StyleSheet.create({
  hero: { flexDirection: 'row', alignItems: 'flex-end' },
  dimpleWrap: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  dimple: { position: 'absolute', width: 52, height: 52 },
  ball: { width: 46, height: 46 },
  rule: { height: 2 * StyleSheet.hairlineWidth, backgroundColor: C.line, marginVertical: 14 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderTopWidth: 2 * StyleSheet.hairlineWidth, borderTopColor: C.line, gap: 12 },
});
