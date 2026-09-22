/**
 * App-wide accessibility theme.
 *
 * The target audience is mostly elderly: the text sizes and touch targets
 * below are deliberately well above the usual minimums, and the contrasts
 * meet (or exceed) WCAG level AA. Don't go below these values without a
 * strong reason.
 */

export const colors = {
  // The app's canvas: a warm beige, deep enough that a white box sitting
  // on it reads as a card on its own. `cardSurface` below still pairs
  // the white with a hairline, which is what keeps a box's edge crisp
  // where it meets the page rather than fading into it.
  background: '#EFE6D5',
  // Boxes, inputs, buttons, and the floating menus. Inside a white panel
  // the nesting goes the other way: a row or a field takes `background`,
  // so the beige is what separates it from the white around it.
  surface: '#FFFFFF',
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
  // A warm coral wash, for the one thing that is currently selected on a
  // white surface — the menu button you are on, the donation amount you
  // picked. Paired with a coral, bolded label, never carrying the meaning
  // on its own.
  primarySoft: '#F9DDD2',
  danger: '#B3261E',
  dangerText: '#FFFFFF',
  border: '#111111',
  // Hairline for the edge of a white card on the beige page. Warm rather
  // than grey so it reads as a shadow's edge instead of a drawn line.
  cardBorder: 'rgba(92,70,44,0.16)',
  focus: '#E1663F',
} as const;

/**
 * Every white box on the page: the fill plus the hairline that makes its
 * edge visible. The page is only just off white, so a box without this
 * has no edge at all — spread it instead of setting `backgroundColor`.
 */
export const cardSurface = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.cardBorder,
} as const;

/**
 * The shadow under the two floating menus. Both platforms need their own
 * half of this: `elevation` is Android's, the rest is iOS's.
 */
export const floatingShadow = {
  shadowColor: '#3A2A14',
  shadowOpacity: 0.16,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 5 },
  elevation: 8,
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
  // The floating menus and the profile circle: round enough to read as
  // lozenges rather than as boxes with the corners taken off.
  pill: 26,
} as const;

export const theme = { colors, fontSizes, spacing, minTouchTarget, radii };

export type Theme = typeof theme;
