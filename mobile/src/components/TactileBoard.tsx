// The tactile month board: paper, pressed-in dimples and a ball you drag,
// flick or send to a day. Port of the physics in src/tactile.html.
import * as Haptics from 'expo-haptics';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Platform, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { BallSim } from '../lib/ball';
import { bn, type MonthData, WEEKDAYS_EN, WEEKDAYS_SHORT_MY } from '../lib/calendar';
import { C } from '../lib/theme';
import { Txt } from './Txt';

const IMG = {
  dimple: require('../../assets/tactile/dimple.png'),
  full: require('../../assets/tactile/dimple-full.png'),
  hol: require('../../assets/tactile/dimple-hol.png'),
  ball: require('../../assets/tactile/ball.png'),
  shadow: require('../../assets/tactile/shadow.png'),
  contact: require('../../assets/tactile/contact.png'),
};
const WD = WEEKDAYS_EN.map((w) => w.slice(0, 3));

interface Cell { key: string; x: number; y: number; l: number; t: number; r: number; b: number }

interface Props {
  data: MonthData;
  width: number;
  selected: string;
  today: string;
  onSelect: (key: string) => void;
  onHold?: (held: boolean) => void;
}

export function TactileBoard({ data, width, selected, today, onSelect, onHold }: Props) {
  const gridW = width;
  const cw = gridW / 7;
  const ch = Math.round(cw * 1.14);
  const rows = Math.ceil((data.lead + data.days.length) / 7);
  const gridH = rows * ch;
  const D = Math.min(Math.round(cw * 0.64), 38); // dimple size
  const B = Math.round(D * 1.06); // ball size
  const R = B / 2;

  const cells: Cell[] = useMemo(
    () =>
      data.days.map((d, i) => {
        const idx = data.lead + i;
        const l = (idx % 7) * cw;
        const t = Math.floor(idx / 7) * ch;
        return { key: d.key, x: l + cw / 2 + 1, y: t + ch * 0.62, l, t, r: l + cw, b: t + ch };
      }),
    [data, cw, ch],
  );

  const [sim] = useState(() => new BallSim());
  const monthKey = `${data.y}-${data.m}`;

  // keep the simulation in step with layout and props, then place/roll the ball
  useLayoutEffect(() => {
    sim.sync({
      cells, R, W: gridW, H: gridH, onSelect, onHold: onHold ?? (() => {}),
      onLand: () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      },
    });
    sim.place(monthKey, selected);
  });

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => sim.setReduceMotion(v)).catch(() => {});
    return () => sim.stop();
  }, [sim]);

  // derived ball visuals
  const { pos, lift, spin, pan } = sim;
  const scale = lift.interpolate({ inputRange: [0, 100], outputRange: [1, 1.42], extrapolate: 'clamp' });
  const shOff = lift.interpolate({ inputRange: [0, 100], outputRange: [R * 0.16, R * 0.16 + 22], extrapolate: 'clamp' });
  const shScale = lift.interpolate({ inputRange: [0, 100], outputRange: [1, 1.35], extrapolate: 'clamp' });
  const shOpacity = lift.interpolate({ inputRange: [0, 100], outputRange: [0.55, 0.22], extrapolate: 'clamp' });
  const contactOpacity = lift.interpolate({ inputRange: [0, 10], outputRange: [0.9, 0], extrapolate: 'clamp' });
  const rot = spin.interpolate({ inputRange: [-Math.PI, Math.PI], outputRange: ['-180deg', '180deg'], extrapolate: 'extend' });
  const tx = Animated.subtract(pos.x, R);
  const ty = Animated.subtract(pos.y, R);
  const SH = B * 1.9;

  return (
    <View style={st.root}>
      <View style={st.week}>
        {WD.map((w, i) => (
          <View key={i} style={{ width: cw, paddingLeft: 2 }}>
            <Txt size={9} weight="medium" caps color={C.soft}>{w}</Txt>
            <Txt size={8.5} color={C.soft} style={{ lineHeight: 13 }}>{WEEKDAYS_SHORT_MY[i]}</Txt>
          </View>
        ))}
      </View>
      <View style={{ width: gridW, height: gridH }}>
        {Array.from({ length: rows + 1 }).map((_, r) => (
          <View key={r} style={[st.rule, { top: r * ch, width: gridW }]} />
        ))}
        {data.days.map((d, i) => {
          const c = cells[i];
          const hol = d.holidays.length > 0;
          const sel = d.key === selected;
          const isToday = d.key === today;
          const label = `${d.d}${hol ? ', ' + d.holidays[0].en : ''}${d.phase === 1 ? ', full moon' : ''}${d.sabbath ? ', Sabbath' : ''}`;
          return (
            <Pressable
              key={d.key}
              onPress={() => sim.send(d.key)}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: sel }}
              style={{ position: 'absolute', left: c.l, top: c.t, width: cw, height: ch }}
            >
              <View style={st.top}>
                <View style={[st.num, sel && { backgroundColor: C.mark }, isToday && st.today]}>
                  <Txt size={11} weight={sel ? 'bold' : 'medium'} color={hol && !sel ? C.red : C.ink}>{d.d}</Txt>
                </View>
                {d.phase === 1 ? <View style={[st.moon, st.full]} /> : d.phase === 3 ? <View style={[st.moon, { backgroundColor: C.ink }]} /> : (
                  <Txt size={9.5} color={C.soft} style={{ lineHeight: 16 }}>{bn(d.fortnightDay)}</Txt>
                )}
                {d.sabbath && d.phase !== 1 && d.phase !== 3 ? <View style={st.sab} /> : null}
              </View>
              <Image
                source={hol ? IMG.hol : d.phase === 1 ? IMG.full : IMG.dimple}
                style={{ position: 'absolute', width: D * 1.08, height: D * 1.08, left: c.x - c.l - (D * 1.08) / 2, top: c.y - c.t - (D * 1.08) / 2 }}
              />
            </Pressable>
          );
        })}

        {/* ball: shadow, contact shadow, the ball itself, and a larger grab area */}
        <Animated.Image
          pointerEvents="none"
          source={IMG.shadow}
          style={{ position: 'absolute', width: SH, height: SH, left: R - SH / 2, top: R - SH / 2, opacity: shOpacity,
            transform: [{ translateX: tx }, { translateY: ty }, { translateX: shOff }, { translateY: shOff }, { scale: shScale }] }}
        />
        <Animated.Image
          pointerEvents="none"
          source={IMG.contact}
          style={{ position: 'absolute', width: B * 1.05, height: B * 1.05, left: -B * 0.025 + 1.5, top: -B * 0.025 + 1.5, opacity: contactOpacity,
            transform: [{ translateX: tx }, { translateY: ty }] }}
        />
        <Animated.Image
          pointerEvents="none"
          source={IMG.ball}
          style={{ position: 'absolute', width: B, height: B, transform: [{ translateX: tx }, { translateY: ty }, { scale }, { rotate: rot }] }}
        />
        <Animated.View
          {...pan.panHandlers}
          testID="ball"
          accessible={false}
          style={{ position: 'absolute', width: B + 16, height: B + 16, left: -8, top: -8, borderRadius: B, transform: [{ translateX: tx }, { translateY: ty }] }}
        />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  // web only: stop the mouse drag from selecting text
  root: Platform.select<ViewStyle>({ web: { userSelect: 'none' } as unknown as ViewStyle, default: {} }),
  week: { flexDirection: 'row', height: 34 },
  rule: { position: 'absolute', left: 0, height: StyleSheet.hairlineWidth * 2, backgroundColor: C.line },
  top: { position: 'absolute', left: 0, top: 4, flexDirection: 'row', alignItems: 'center', gap: 3 },
  num: { minWidth: 17, height: 16, paddingHorizontal: 2, justifyContent: 'center' },
  today: { borderBottomWidth: 1.5, borderBottomColor: C.ink },
  moon: { width: 8, height: 8, borderRadius: 4 },
  full: { backgroundColor: C.red, shadowColor: C.red, shadowOpacity: 0.3, shadowRadius: 2, shadowOffset: { width: 0, height: 0 } },
  sab: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.gold },
});
