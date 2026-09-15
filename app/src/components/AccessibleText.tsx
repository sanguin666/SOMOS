import { Text, type TextProps, StyleSheet } from 'react-native';
import { colors, fontSizes } from '../theme/theme';

type Variant = 'title' | 'body' | 'bodyLarge' | 'caption';

type Props = TextProps & {
  variant?: Variant;
  color?: string;
};

/**
 * Texte accessible par défaut : ne jamais mettre `allowFontScaling={false}`
 * ici, pour que le texte suive le réglage de taille de police du téléphone.
 */
export function AccessibleText({
  variant = 'body',
  color,
  style,
  ...rest
}: Props) {
  return (
    <Text
      allowFontScaling
      style={[styles[variant], color ? { color } : null, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: fontSizes.title,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: fontSizes.body,
    color: colors.text,
  },
  bodyLarge: {
    fontSize: fontSizes.bodyLarge,
    color: colors.text,
  },
  caption: {
    fontSize: fontSizes.caption,
    color: colors.textMuted,
  },
});
