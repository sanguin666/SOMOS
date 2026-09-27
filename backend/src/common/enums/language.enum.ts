export enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  // Valencian has no ISO 639-1 code of its own; see intlLocale for dates.
  VA = 'va',
  GL = 'gl',
  PT = 'pt',
}

/**
 * The locale Intl formats with: Valencian uses Catalan's ('ca'), and
 * Portuguese is the European one (pt-PT).
 */
export function intlLocale(language: Language): string {
  if (language === Language.VA) return 'ca-ES';
  if (language === Language.PT) return 'pt-PT';
  return language;
}
