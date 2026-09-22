import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/translations';

/**
 * Each language written in itself, never translated. Somebody who opened
 * the dashboard in a language they cannot read is exactly who this list
 * is for, so they have to recognise their own among the three.
 */
const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

/**
 * The app's language picker, brought to the web: one row carrying the
 * language it is currently set to, rather than three abbreviations side
 * by side. The list only appears once somebody asks for it — a white
 * sheet of rows split by orange lines, the one in use named by its colour
 * and a tick, and a Close button as the way out.
 */
export function LanguagePicker() {
  const { t, language, setLanguage } = useI18n();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // A native <dialog> opened with showModal() gets the focus trap and the
  // Escape key for free; Escape fires `close`, which is kept in step here.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function choose(code: SupportedLanguage) {
    setLanguage(code);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="language-row"
        aria-label={`${t('layout.language')}: ${LANGUAGE_NAMES[language]}`}
        onClick={() => setOpen(true)}
      >
        <GlobeIcon />
        <span className="language-row-label">{t('layout.language')}</span>
        <span className="language-row-value">{LANGUAGE_NAMES[language]}</span>
        <ChevronRightIcon />
      </button>

      <dialog
        ref={dialogRef}
        className="sheet"
        aria-labelledby="language-sheet-title"
        onClose={() => setOpen(false)}
        // A click on the dimmed backdrop lands on the dialog element
        // itself, never on anything inside it.
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="sheet-body">
          <h2 id="language-sheet-title" className="sheet-title">
            {t('layout.chooseLanguage')}
          </h2>
          <div>
            {SUPPORTED_LANGUAGES.map((code) => {
              const selected = code === language;
              return (
                <button
                  key={code}
                  type="button"
                  className={`sheet-option ${selected ? 'sheet-option-selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => choose(code)}
                >
                  <span lang={code}>{LANGUAGE_NAMES[code]}</span>
                  {/* A tick as well as the colour, so the choice is not
                      carried by colour alone. */}
                  {selected && <CheckIcon />}
                </button>
              );
            })}
          </div>
          <button type="button" className="btn btn-block" onClick={() => setOpen(false)}>
            {t('layout.close')}
          </button>
        </div>
      </dialog>
    </>
  );
}

// The same three icons the app draws, at the size a pointer needs.

function GlobeIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={2} />
      <path d="M3 12h18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <path
        d="M12 3c2.6 2.4 4 5.4 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.4-4-9s1.4-6.6 4-9Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
