export enum Language {
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  // Valencian has no ISO 639-1 code of its own; see intlLocale for dates.
  VA = 'va',
}

/** The locale Intl formats with: Valencian uses Catalan's ('ca'). */
export function intlLocale(language: Language): string {
  if (language === Language.VA) return 'ca-ES';
  return language;
}
