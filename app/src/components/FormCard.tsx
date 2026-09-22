import { type ReactNode, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { cardSurface, colors, fontSizes, minTouchTarget, radii, spacing } from '../theme/theme';

/**
 * A form, as one white card on the beige canvas.
 *
 * The rule this exists to hold: only ever one white box deep. A field
 * inside a card must not be a box of its own — no fill, no border — or
 * the card reads as a box inside a box. So the card is the only edge on
 * screen, each field is a row in it, and the rows are told apart by a
 * hairline rather than by four more.
 */
export function FormCard({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

/** A hairline between two rows of a `FormCard`. */
export function FormDivider() {
  return <View style={styles.divider} />;
}

/**
 * A row of a `FormCard` that is not a text field — the picture chooser,
 * say. Takes the same label treatment so every row reads alike.
 */
export function FormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.row}>
      <AccessibleText variant="caption" color={colors.textMuted}>
        {label}
      </AccessibleText>
      {children}
    </View>
  );
}

type FieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  // For a field meant to hold a few sentences rather than a few words.
  tall?: boolean;
};

/**
 * One text field: its name in small type above what is being typed, and
 * a rule underneath that lights up while the field has focus.
 *
 * The label stays put rather than floating into the field, so somebody
 * halfway through typing can still see what they are answering — which
 * is the whole reason it sits above the value.
 */
export function FormField({ label, tall = false, ...rest }: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.row}>
      <AccessibleText
        variant="caption"
        color={focused ? colors.primaryStrong : colors.textMuted}
        style={focused ? styles.labelFocused : undefined}
      >
        {label}
      </AccessibleText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={tall ? [styles.input, styles.inputTall] : styles.input}
        {...rest}
      />
      {/* Two states of the same rule rather than one appearing: the row
          keeps its height when focus arrives. */}
      <View style={focused ? styles.ruleFocused : styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardSurface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  row: {
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  labelFocused: {
    fontWeight: '700',
  },
  input: {
    minHeight: minTouchTarget - spacing.sm,
    fontSize: fontSizes.bodyLarge,
    color: colors.text,
    // No fill and no border: the card is the box, this is a line in it.
    paddingHorizontal: 0,
  },
  inputTall: {
    minHeight: 96,
    textAlignVertical: 'top',
    paddingTop: spacing.xs,
  },
  rule: {
    height: 2,
    backgroundColor: colors.cardBorder,
  },
  ruleFocused: {
    height: 2,
    backgroundColor: colors.primary,
  },
});
