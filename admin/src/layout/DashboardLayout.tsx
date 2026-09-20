import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n/translations';
import { LogoMark } from '../components/LogoMark';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  es: 'ES',
  fr: 'FR',
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const navigate = useNavigate();
  const { poiId } = useParams<{ poiId: string }>();

  if (!user) return null;

  const currentPoi = user.adminPois.find((p) => p.id === poiId);

  const navItems = [
    { to: 'donations', label: t('layout.navDonations') },
    { to: 'events', label: t('layout.navEvents') },
    { to: 'announcements', label: t('layout.navAnnouncements') },
    { to: 'livestreams', label: t('layout.navLivestreams') },
    { to: 'prayer-requests', label: t('layout.navPrayerRequests') },
    { to: 'community', label: t('layout.navCommunity') },
    { to: 'my-qr', label: t('layout.navMyQr') },
    { to: 'settings', label: t('layout.navSettings') },
  ];

  function handlePoiChange(nextPoiId: string) {
    navigate(`/poi/${nextPoiId}/donations`);
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LogoMark size={28} />
            <h1>SOMOS Admin</h1>
          </div>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            {user.firstName ?? user.email}
          </p>
        </div>

        {user.adminPois.length > 1 ? (
          <div className="poi-switcher">
            <label htmlFor="poi-select" style={{ fontSize: 13, fontWeight: 600 }}>
              {t('layout.managing')}
            </label>
            <select
              id="poi-select"
              value={poiId}
              onChange={(e) => handlePoiChange(e.target.value)}
            >
              {user.adminPois.map((poi) => (
                <option key={poi.id} value={poi.id}>
                  {poi.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          currentPoi && <p style={{ fontWeight: 600 }}>{currentPoi.name}</p>
        )}

        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-lang-switcher" style={{ marginBottom: 12 }}>
            {SUPPORTED_LANGUAGES.map((code) => (
              <button
                key={code}
                type="button"
                className={`lang-pill ${code === language ? 'lang-pill-active' : ''}`}
                onClick={() => setLanguage(code)}
                aria-label={LANGUAGE_LABELS[code]}
              >
                {LANGUAGE_LABELS[code]}
              </button>
            ))}
          </div>
          <button type="button" className="btn" onClick={logout} style={{ width: '100%' }}>
            {t('layout.signOut')}
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet context={{ poiId: poiId! }} />
      </main>
    </div>
  );
}
