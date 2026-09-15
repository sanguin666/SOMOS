/**
 * Thème d'accessibilité de l'application.
 *
 * Le public cible est majoritairement âgé : les tailles de texte et de
 * zones tactiles ci-dessous sont volontairement bien au-dessus des minimums
 * habituels, et les contrastes respectent (ou dépassent) le niveau AA du
 * WCAG. Ne pas descendre en dessous de ces valeurs sans raison forte.
 */

export const colors = {
  background: '#FFFFFF',
  surface: '#F4F6F8',
  text: '#111111',
  textMuted: '#3D3D3D',
  primary: '#1A4D8F',
  primaryText: '#FFFFFF',
  danger: '#B3261E',
  dangerText: '#FFFFFF',
  border: '#111111',
  focus: '#1A4D8F',
} as const;

// Échelle de tailles volontairement large. React Native met à l'échelle ces
// valeurs selon le réglage "taille de police" du système par défaut
// (Text.allowFontScaling n'est jamais désactivé dans nos composants).
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

// Taille tactile minimale recommandée pour un public peu à l'aise avec le
// tactile précis (bien au-dessus des 44-48px habituellement recommandés).
export const minTouchTarget = 64;

export const radii = {
  md: 12,
  lg: 16,
} as const;

export const theme = { colors, fontSizes, spacing, minTouchTarget, radii };

export type Theme = typeof theme;
