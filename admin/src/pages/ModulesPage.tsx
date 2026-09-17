import { useEffect, useState } from 'react';
import { usePoiId } from '../layout/usePoiId';
import { useI18n } from '../i18n/I18nContext';
import { activateModule, getActiveModules, setModuleStatus } from '../api/activeModules';
import { getPoi } from '../api/pois';
import { updatePoiLanguage } from '../api/poiSettings';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/translations';
import type { ActiveModule, ModuleType, Poi } from '../api/types';

const LIVE_STATUSES = new Set(['trial', 'active']);

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export function ModulesPage() {
  const poiId = usePoiId();
  const { t } = useI18n();
  const [modules, setModules] = useState<ActiveModule[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<ModuleType | null>(null);

  const [poi, setPoi] = useState<Poi | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [savingLanguage, setSavingLanguage] = useState(false);
  const [languageError, setLanguageError] = useState<string | null>(null);

  const ALL_MODULE_TYPES: { type: ModuleType; label: string }[] = [
    { type: 'donations', label: t('moduleNames.donations') },
    { type: 'events', label: t('moduleNames.events') },
    { type: 'announcements', label: t('moduleNames.announcements') },
    { type: 'prayer_requests', label: t('moduleNames.prayerRequests') },
    { type: 'livestreams', label: t('moduleNames.livestream') },
    { type: 'community', label: t('moduleNames.community') },
  ];

  function load() {
    getActiveModules(poiId)
      .then(setModules)
      .catch(() => setError(t('modules.loadError')));
    getPoi(poiId).then((result) => {
      setPoi(result);
      setSelectedLanguage(result.language);
    });
  }

  useEffect(load, [poiId]);

  async function handleToggle(type: ModuleType, existing: ActiveModule | undefined) {
    setPendingType(type);
    try {
      if (!existing) {
        const created = await activateModule(poiId, type);
        setModules((current) => [...(current ?? []), created]);
      } else {
        const isLive = LIVE_STATUSES.has(existing.status);
        const updated = await setModuleStatus(poiId, existing.id, isLive ? 'cancelled' : 'active');
        setModules((current) => current?.map((m) => (m.id === existing.id ? updated : m)) ?? null);
      }
    } catch {
      setError(t('modules.updateError'));
    } finally {
      setPendingType(null);
    }
  }

  async function saveLanguage() {
    setSavingLanguage(true);
    setLanguageError(null);
    try {
      const updated = await updatePoiLanguage(poiId, selectedLanguage);
      setPoi(updated);
    } catch {
      setLanguageError(t('modules.languageSaveError'));
    } finally {
      setSavingLanguage(false);
    }
  }

  return (
    <div>
      <h2>{t('modules.title')}</h2>
      <p className="muted">{t('modules.subtitle')}</p>

      {poi && (
        <div className="card">
          <p className="card-title">{t('modules.contentLanguageTitle')}</p>
          <p className="muted" style={{ marginTop: 4 }}>
            {t('modules.contentLanguageSubtitle')}
          </p>
          <div className="card-actions">
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}>
              {SUPPORTED_LANGUAGES.map((code) => (
                <option key={code} value={code}>
                  {LANGUAGE_NAMES[code]}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary"
              disabled={savingLanguage || selectedLanguage === poi.language}
              onClick={saveLanguage}
            >
              {savingLanguage ? t('modules.savingLanguage') : t('modules.saveLanguage')}
            </button>
          </div>
          {languageError && <p className="error-text">{languageError}</p>}
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
      {modules === null && !error && <p className="muted">{t('modules.loading')}</p>}

      {modules !== null &&
        ALL_MODULE_TYPES.map(({ type, label }) => {
          const existing = modules.find((m) => m.moduleType === type);
          const isLive = existing ? LIVE_STATUSES.has(existing.status) : false;
          return (
            <div key={type} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p className="card-title">{label}</p>
                <span className={`badge ${isLive ? 'badge-active' : ''}`}>
                  {existing ? existing.status : t('modules.notActivated')}
                </span>
              </div>
              <button
                type="button"
                className={isLive ? 'btn btn-danger' : 'btn btn-primary'}
                disabled={pendingType === type}
                onClick={() => handleToggle(type, existing)}
              >
                {isLive ? t('modules.deactivate') : t('modules.activate')}
              </button>
            </div>
          );
        })}
    </div>
  );
}
