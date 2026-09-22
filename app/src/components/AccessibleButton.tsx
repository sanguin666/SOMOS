import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { colors, fontSizes, minTouchTarget, radii, spacing } from '../theme/theme';

/**
 * `secondary` is the only one with a white fill and a border, which makes
 * it a box — so it belongs on the beige canvas and never inside a white
 * card or sheet, where it would read as a box within a box. Inside white,
 * use `primary` or `danger` for anything that acts, and `quiet` for the
 * way out (Cancel, Close), which has no box at all.
 *
 * `destructive` is the white row with a red label — the same look as
 * "Leave this place" in the More menu — for anything that undoes
 * something from the beige canvas. It is a box too, so inside white use
 * `danger`, which is the same meaning as a filled button.
 */
type Variant = 'primary' | 'secondary' | 'danger' | 'destructive' | 'quiet';

type Props = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: Variant;
  // Reserved for layout tweaks (margins, width): accessibility-related
  // styles (size, contrast) are deliberately not overridable.
  style?: ViewStyle;
};

/**
 * Single button component for the whole app: large touch target, large
 * text, strong contrast. Always use this instead of an ad hoc
 * TouchableOpacity, to keep the experience consistent and accessible.
 */
export function AccessibleButton({
  label,
  variant = 'primary',
  style,
  ...rest
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={spacing.sm}
      style={({ pressed }) => [
        styles.base,
        containerStyles[variant],
        style,
        pressed && styles.pressed,
      ]}
      {...rest}
    >
      <AccessibleText variant="body" style={[styles.label, labelStyles[variant]]}>
        {label}
      </AccessibleText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: minTouchTarget,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    fontSize: fontSizes.button,
    fontWeight: '700',
    textAlign: 'center',
  },
});

const containerStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderColor: colors.border },
  danger: { backgroundColor: colors.danger, borderColor: colors.danger },
  destructive: { backgroundColor: colors.surface, borderColor: colors.border },
  quiet: { backgroundColor: 'transparent', borderColor: 'transparent' },
});

const labelStyles = StyleSheet.create({
  primary: { color: colors.primaryText },
  secondary: { color: colors.text },
  danger: { color: colors.dangerText },
  destructive: { color: colors.danger },
  quiet: { color: colors.textMuted },
});
