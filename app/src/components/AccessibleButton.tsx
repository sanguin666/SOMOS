import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { colors, fontSizes, minTouchTarget, radii, spacing } from '../theme/theme';

/**
 * Three buttons, and no fourth. A button is not a box, so all three are
 * allowed inside a white card or sheet as well as on the beige canvas.
 *
 * `primary` is the orange button, and it is every call to action in the
 * app without exception — save, send, add a picture, and the confirm on
 * a question, however serious the answer. What a button does is said by
 * its label, not by giving it a colour of its own.
 *
 * `secondary` is white with the same heavy edge: the way out standing
 * beside a primary (Cancel, Close, No, stay).
 *
 * `destructive` is that same white button with a red label — the look of
 * "Leave this place" — for the thing that undoes something: signing out,
 * leaving a place. It opens the question; `primary` answers it.
 */
type Variant = 'primary' | 'secondary' | 'destructive';

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
  destructive: { backgroundColor: colors.surface, borderColor: colors.border },
});

const labelStyles = StyleSheet.create({
  primary: { color: colors.primaryText },
  secondary: { color: colors.text },
  destructive: { color: colors.danger },
});
