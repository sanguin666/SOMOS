/**
 * App-wide accessibility theme.
 *
 * The target audience is mostly elderly: the text sizes and touch targets
 * below are deliberately well above the usual minimums, and the contrasts
 * meet (or exceed) WCAG level AA. Don't go below these values without a
 * strong reason.
 */

export const colors = {
  background: '#FFFFFF',
  surface: '#F7F1E7',
  text: '#111111',
  textMuted: '#3D3D3D',
  primary: '#E1663F',
  // Same hue as `primary`, darkened until it clears 4.5:1 on white — use
  // this instead of `primary` wherever the brand color is small text or a
  // small filled shape (a link, a small badge). `primary` itself only
  // reaches ~3.2:1 on white, which is fine for large/bold text (≥22px
  // bold, e.g. AccessibleButton's label) and for graphical elements (icons,
  // large fills), per WCAG's large-text and non-text contrast thresholds,
  // but not for anything smaller.
  primaryStrong: '#B8502E',
  primaryText: '#FFFFFF',
  danger: '#B3261E',
  dangerText: '#FFFFFF',
  border: '#111111',
  focus: '#E1663F',
} as const;

// Deliberately large size scale. React Native scales these values
// according to the device's system font size setting by default
// (Text.allowFontScaling is never disabled in our components).
export const fontSizes = {
  body: 20,
  bodyLarge: 24,
  title: 30,
  button: 22,
  caption: 17,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

// Minimum recommended touch target for an audience not comfortable with
// precise tapping (well above the usual 44-48px recommendation).
export const minTouchTarget = 64;

export const radii = {
  md: 12,
  lg: 16,
} as const;

export const theme = { colors, fontSizes, spacing, minTouchTarget, radii };

export type Theme = typeof theme;
