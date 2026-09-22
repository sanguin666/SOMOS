import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { LogoMark } from '../components/LogoMark';
import { LanguagePicker } from '../components/LanguagePicker';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
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
    { to: 'home-page', label: t('layout.navHomePage') },
    { to: 'my-qr', label: t('layout.navMyQr') },
    { to: 'settings', label: t('layout.navSettings') },
  ];

  function handlePoiChange(nextPoiId: string) {
    navigate(`/poi/${nextPoiId}/donations`);
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">
            <LogoMark size={30} />
            <h1>ANSAE Admin</h1>
          </div>
          <p className="sidebar-user">{user.firstName ?? user.email}</p>
        </div>

        <hr className="menu-divider" />

        {user.adminPois.length > 1 ? (
          <div className="poi-switcher">
            <label htmlFor="poi-select">{t('layout.managing')}</label>
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
          currentPoi && <p className="poi-name">{currentPoi.name}</p>
        )}

        <hr className="menu-divider" />

        <nav>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <hr className="menu-divider" />
          <LanguagePicker />
          <button type="button" className="btn btn-destructive btn-block" onClick={logout}>
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
