import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { colors, fontSizes, minTouchTarget, radii, spacing } from '../theme/theme';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: Variant;
  // Réservé aux ajustements de mise en page (marges, largeur) : les styles
  // d'accessibilité (taille, contraste) ne sont volontairement pas surchargeables.
  style?: ViewStyle;
};

/**
 * Bouton unique pour toute l'app : grande zone tactile, texte large,
 * contraste fort. Toujours utiliser ce composant plutôt qu'un TouchableOpacity
 * ad hoc, pour garder une expérience homogène et accessible.
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
  secondary: { backgroundColor: colors.background, borderColor: colors.border },
  danger: { backgroundColor: colors.danger, borderColor: colors.danger },
});

const labelStyles = StyleSheet.create({
  primary: { color: colors.primaryText },
  secondary: { color: colors.text },
  danger: { color: colors.dangerText },
});
