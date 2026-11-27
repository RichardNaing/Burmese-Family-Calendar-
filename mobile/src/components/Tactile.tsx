// Shared tactile building blocks: paper board, raised pill, tag.
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Image, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { C } from '../lib/theme';
import { Txt } from './Txt';

const PAPER = require('../../assets/tactile/paper.jpg');

/** A sheet of textured paper with a soft drop shadow. */
export function Paper({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return (
    <View style={[st.paperShadow, style]}>
      <View style={st.paper}>
        <Image source={PAPER} resizeMode="cover" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)', 'rgba(60,52,40,0.07)']}
          locations={[0, 0.45, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {children}
      </View>
    </View>
  );
}

/** Raised pill button (‹ Today ›). */
export function Pill({
  label, onPress, active, accessibilityLabel, minWidth = 30,
}: { label: string; onPress: () => void; active?: boolean; accessibilityLabel?: string; minWidth?: number }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} hitSlop={6}>
      {({ pressed }) => (
        <View style={[st.pillShadow, pressed && st.pillPressed]}>
          <LinearGradient
            colors={active ? [C.ink, '#2C2B28'] : pressed ? [C.pillLo, C.pillHi] : [C.pillHi, C.pillLo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[st.pill, { minWidth }]}
          >
            <Txt size={label.length === 1 ? 16 : 11} weight="medium" color={active ? C.paper : C.ink} caps={label.length > 1}>
              {label}
            </Txt>
          </LinearGradient>
        </View>
      )}
    </Pressable>
  );
}

/** Small raised tag. */
export function Tag({ children, color = C.ink }: { children: ReactNode; color?: string }) {
  return (
    <View style={st.tagShadow}>
      <LinearGradient colors={[C.pillHi, '#E5E2DC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={st.tag}>
        {typeof children === 'string' ? <Txt size={11} weight="medium" color={color}>{children}</Txt> : children}
      </LinearGradient>
    </View>
  );
}

const st = StyleSheet.create({
  paperShadow: {
    borderRadius: 3,
    backgroundColor: C.paper,
    shadowColor: '#28221A',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  paper: { borderRadius: 3, overflow: 'hidden', backgroundColor: C.paper },
  pillShadow: {
    borderRadius: 16,
    shadowColor: '#342E24',
    shadowOpacity: 0.28,
    shadowRadius: 2,
    shadowOffset: { width: 1, height: 1 },
    elevation: 2,
  },
  pillPressed: { transform: [{ translateY: 1 }], shadowOpacity: 0.1, elevation: 0 },
  pill: { height: 32, paddingHorizontal: 12, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tagShadow: {
    borderRadius: 12,
    shadowColor: '#342E24',
    shadowOpacity: 0.22,
    shadowRadius: 1.5,
    shadowOffset: { width: 0.75, height: 0.75 },
    elevation: 1,
  },
  tag: { borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3 },
});
