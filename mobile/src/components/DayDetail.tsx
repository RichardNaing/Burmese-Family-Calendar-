import { StyleSheet, View } from 'react-native';
import {
  bn, burmeseDateLine, type DayInfo, englishDateLine, GREG_MONTHS, GREG_MONTHS_MY, PHASES_EN, PHASES_MY,
  WEEKDAYS_EN, WEEKDAYS_MY,
} from '../lib/calendar';
import { type Lang, t } from '../lib/i18n';
import { C } from '../lib/theme';
import { Txt } from './Txt';

export function DayDetail({ d, lang }: { d: DayInfo; lang: Lang }) {
  const my = lang === 'my';
  const special = d.phase === 1 || d.phase === 3;
  return (
    <View style={st.wrap}>
      <View style={st.hero}>
        <Txt size={64} bold style={{ lineHeight: 70 }}>{my ? bn(d.d) : d.d}</Txt>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Txt size={18} bold>{my ? `${GREG_MONTHS_MY[d.m - 1]} ${bn(d.y)}` : `${GREG_MONTHS[d.m - 1]} ${d.y}`}</Txt>
          <Txt size={15} color={C.soft}>{my ? `${WEEKDAYS_MY[d.weekday]}နေ့` : WEEKDAYS_EN[d.weekday]}</Txt>
        </View>
      </View>

      <View style={st.card}>
        <Txt size={18} bold color={C.red}>{burmeseDateLine(d)}</Txt>
        <Txt size={13} color={C.soft}>{englishDateLine(d)}</Txt>
        <View style={st.tags}>
          {special ? (
            <Tag color={d.phase === 1 ? C.red : C.ink} text={my ? PHASES_MY[d.phase] : PHASES_EN[d.phase]} solid />
          ) : null}
          {d.sabbath ? <Tag color={C.gold} text={t(lang, 'sabbath')} /> : null}
          {d.sabbathEve ? <Tag color={C.soft} text={t(lang, 'sabbathEve')} /> : null}
        </View>
      </View>

      {d.holidays.length > 0 ? (
        <View style={[st.card, { borderLeftColor: C.red, borderLeftWidth: 4 }]}>
          <Txt size={12} bold color={C.red}>{t(lang, 'holiday').toUpperCase()}</Txt>
          {d.holidays.map((h, i) => (
            <View key={i} style={{ marginTop: 4 }}>
              <Txt size={17} bold>{h.my}</Txt>
              <Txt size={13} color={C.soft}>{h.en}</Txt>
            </View>
          ))}
          {!d.holidays[0].official ? <Txt size={11} color={C.faint} style={{ marginTop: 6 }}>{t(lang, 'calculated')}</Txt> : null}
        </View>
      ) : null}

      <View style={st.card}>
        <Row label={t(lang, 'yatyaza')} value={d.yatyaza ? '✓' : '—'} hi={d.yatyaza} />
        <Row
          label={t(lang, 'pyathada')}
          value={d.pyathada === 1 ? '✓' : d.pyathada === 2 ? t(lang, 'afternoonPyathada') : '—'}
          warn={d.pyathada > 0}
        />
        <Row label={t(lang, 'nagahle')} value={my ? d.nagahleMy : d.nagahleEn} />
        <Row label={t(lang, 'mahabote')} value={my ? d.mahaboteMy : d.mahaboteEn} />
        {d.astroEn.length ? <Row label={t(lang, 'astro')} value={(my ? d.astroMy : d.astroEn).join(', ')} /> : null}
      </View>
    </View>
  );
}

function Tag({ text, color, solid }: { text: string; color: string; solid?: boolean }) {
  return (
    <View style={[st.tag, { borderColor: color }, solid && { backgroundColor: color }]}>
      <Txt size={12} bold color={solid ? C.paper : color}>{text}</Txt>
    </View>
  );
}

function Row({ label, value, hi, warn }: { label: string; value: string; hi?: boolean; warn?: boolean }) {
  return (
    <View style={st.row}>
      <Txt size={14} color={C.soft} style={{ flex: 1 }}>{label}</Txt>
      <Txt size={14} bold color={warn ? C.red : hi ? C.gold : C.ink} style={{ flexShrink: 1, textAlign: 'right' }}>{value}</Txt>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { gap: 12 },
  hero: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line, gap: 12 },
});
