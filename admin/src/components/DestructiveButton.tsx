import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

/**
 * The thing that undoes something — delete, deactivate, remove — the way
 * the app does "Leave this place": a white button with a red label that
 * only opens the question. The answer is the ordinary orange button
 * ("Yes, delete") beside a white Cancel, so nothing is lost to one stray
 * click and no other red ever appears.
 */
export function DestructiveButton({
  label,
  onConfirm,
  disabled,
}: {
  label: string;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <button type="button" className="btn btn-destructive" disabled={disabled} onClick={() => setAsking(true)}>
        {label}
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        autoFocus
        onClick={() => {
          setAsking(false);
          onConfirm();
        }}
      >
        {t('common.yes')}, {label.charAt(0).toLowerCase() + label.slice(1)}
      </button>
      <button type="button" className="btn" onClick={() => setAsking(false)}>
        {t('common.cancel')}
      </button>
    </>
  );
}
