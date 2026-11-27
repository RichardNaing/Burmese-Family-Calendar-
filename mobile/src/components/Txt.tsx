import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { C, F } from '../lib/theme';

const MY = /[က-႟ꩠ-ꩿ]/;

type Props = TextProps & { size?: number; bold?: boolean; color?: string; style?: TextStyle | TextStyle[] };

/**
 * Text that switches to Noto Sans Myanmar when the string contains Burmese,
 * with taller line height so stacked vowel marks are not clipped.
 */
export function Txt({ children, size = 15, bold, color = C.ink, style, ...rest }: Props) {
  const str = flatten(children);
  const isMy = MY.test(str);
  const base: TextStyle = isMy
    ? { fontFamily: bold ? F.myBold : F.my, fontSize: size, lineHeight: Math.round(size * 1.75), color }
    : { fontSize: size, lineHeight: Math.round(size * 1.3), fontWeight: bold ? '700' : '400', color };
  return (
    <Text {...rest} style={[base, ...(Array.isArray(style) ? style : style ? [style] : [])]}>
      {children}
    </Text>
  );
}

function flatten(c: unknown): string {
  if (c == null || typeof c === 'boolean') return '';
  if (typeof c === 'string' || typeof c === 'number') return String(c);
  if (Array.isArray(c)) return c.map(flatten).join('');
  return '';
}

export const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
});
