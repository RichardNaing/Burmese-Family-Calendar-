import { Text, type TextProps, type TextStyle } from 'react-native';
import { C, F } from '../lib/theme';

const MY = /[က-႟ꩠ-ꩿ]/;

type Weight = 'light' | 'regular' | 'medium' | 'bold';
type Props = TextProps & {
  size?: number;
  bold?: boolean;
  weight?: Weight;
  color?: string;
  caps?: boolean;
  style?: TextStyle | TextStyle[];
};

const MONO: Record<Weight, string> = { light: F.monoLight, regular: F.mono, medium: F.monoMedium, bold: F.monoBold };

/**
 * Martian Mono for Latin text, Noto Sans Myanmar when the string contains
 * Burmese (with taller lines so stacked vowel marks are never clipped).
 */
export function Txt({ children, size = 13, bold, weight, color = C.ink, caps, style, ...rest }: Props) {
  const str = flatten(children);
  const w: Weight = weight ?? (bold ? 'bold' : 'regular');
  const base: TextStyle = MY.test(str)
    ? { fontFamily: w === 'bold' || w === 'medium' ? F.myBold : F.my, fontSize: size, lineHeight: Math.round(size * 1.75), color }
    : {
        fontFamily: MONO[w],
        fontSize: size,
        lineHeight: Math.round(size * 1.35),
        color,
        letterSpacing: caps ? size * 0.06 : -size * 0.01,
        textTransform: caps ? 'uppercase' : 'none',
      };
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
