import { useEffect, useState } from 'react';
import { usePoiId } from '../layout/usePoiId';
import { useI18n } from '../i18n/I18nContext';
import { activateModule, getActiveModules, setModuleStatus } from '../api/activeModules';
import { getPoi } from '../api/pois';
import { updatePoiLanguage, updatePoiProfile } from '../api/poiSettings';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/translations';
import type { ActiveModule, ModuleType, Poi } from '../api/types';
import { MenuOrderCard } from './MenuOrderCard';

const LIVE_STATUSES = new Set(['trial', 'active']);

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export function SettingsPage() {
  const poiId = usePoiId();
  const { t } = useI18n();
  const [modules, setModules] = useState<ActiveModule[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<ModuleType | null>(null);

  const [poi, setPoi] = useState<Poi | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [savingLanguage, setSavingLanguage] = useState(false);
  const [languageError, setLanguageError] = useState<string | null>(null);

  const [description, setDescription] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

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
      setDescription(result.description ?? '');
      setPictureUrl(result.pictureUrl ?? '');
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

  async function saveProfile() {
    setSavingProfile(true);
    setProfileError(null);
    setProfileSaved(false);
    try {
      const updated = await updatePoiProfile(poiId, {
        description: description.trim(),
        pictureUrl: pictureUrl.trim(),
      });
      setPoi(updated);
      setProfileSaved(true);
    } catch {
      setProfileError(t('poiInfo.saveError'));
    } finally {
      setSavingProfile(false);
    }
  }

  return (
    <div>
      <h2>{t('modules.title')}</h2>
      <p className="muted">{t('modules.subtitle')}</p>

      {poi && (
        <div className="card">
          <p className="card-title">{t('poiInfo.title')}</p>
          <p className="muted" style={{ marginTop: 4 }}>
            {t('poiInfo.subtitle')}
          </p>
          <div className="form" style={{ marginTop: 12 }}>
            <label>
              {t('poiInfo.nameLabel')}
              <input value={poi.name} disabled />
            </label>
            <label>
              {t('poiInfo.descriptionLabel')}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('poiInfo.descriptionPlaceholder')}
              />
            </label>
            <label>
              {t('poiInfo.pictureUrlLabel')}
              <input
                value={pictureUrl}
                onChange={(e) => setPictureUrl(e.target.value)}
                placeholder={t('poiInfo.pictureUrlPlaceholder')}
              />
            </label>
            {pictureUrl.trim() && (
              <img
                src={pictureUrl.trim()}
                alt={t('poiInfo.pictureAlt')}
                style={{ maxWidth: 160, maxHeight: 160, borderRadius: 8, objectFit: 'cover' }}
              />
            )}
            <div className="card-actions">
              <button type="button" className="btn btn-primary" disabled={savingProfile} onClick={saveProfile}>
                {savingProfile ? t('poiInfo.saving') : t('poiInfo.save')}
              </button>
            </div>
            {profileError && <p className="error-text">{profileError}</p>}
            {profileSaved && !profileError && <p className="muted">{t('poiInfo.saveSuccess')}</p>}
          </div>
        </div>
      )}

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

      {poi && modules !== null && (
        <MenuOrderCard poi={poi} modules={modules} onSaved={setPoi} />
      )}

      <h3 style={{ marginTop: 24 }}>{t('modules.modulesSectionTitle')}</h3>

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
