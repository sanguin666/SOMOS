import { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { LogoMark } from '../components/LogoMark';
import { LanguagePicker } from '../components/LanguagePicker';
import { PickerRow, PickerSheet, PinIcon } from '../components/PickerSheet';
import { getActiveModules } from '../api/activeModules';
import type { ActiveModule, ModuleType } from '../api/types';
import type { DashboardContext } from './usePoiId';

const LIVE_STATUSES = new Set(['trial', 'active']);

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { poiId } = useParams<{ poiId: string }>();
  const [poiPickerOpen, setPoiPickerOpen] = useState(false);
  // Kept with the place they belong to, so switching places never shows
  // the last place's pages while the new list loads.
  const [loaded, setLoaded] = useState<{ poiId: string; modules: ActiveModule[] } | null>(null);
  const modules = loaded && loaded.poiId === poiId ? loaded.modules : null;

  const refreshModules = useCallback(() => {
    if (!poiId) return;
    getActiveModules(poiId)
      .then((list) => setLoaded({ poiId, modules: list }))
      // Only the pages that need a module go missing from the menu; the
      // rest of the dashboard works without this.
      .catch(() => setLoaded({ poiId, modules: [] }));
  }, [poiId]);

  useEffect(refreshModules, [refreshModules]);

  if (!user) return null;

  const currentPoi = user.adminPois.find((p) => p.id === poiId);

  function isLive(type: ModuleType) {
    return !!modules?.some((m) => m.moduleType === type && LIVE_STATUSES.has(m.status));
  }

  // Requests and Mass intentions are pages of work for the office, so they
  // only show while the community runs that module.
  const navItems = [
    { to: 'dashboard', label: t('layout.navDashboard') },
    { to: 'home-page', label: t('layout.navHomePage') },
    ...(isLive('requests') ? [{ to: 'requests', label: t('layout.navRequests') }] : []),
    { to: 'donations', label: t('layout.navDonations') },
    { to: 'events', label: t('layout.navEvents') },
    ...(isLive('mass_intentions') ? [{ to: 'mass-intentions', label: t('layout.navMassIntentions') }] : []),
    { to: 'announcements', label: t('layout.navAnnouncements') },
    { to: 'livestreams', label: t('layout.navLivestreams') },
    { to: 'prayer-requests', label: t('layout.navPrayerRequests') },
    { to: 'community', label: t('layout.navCommunity') },
    { to: 'my-qr', label: t('layout.navMyQr') },
    { to: 'settings', label: t('layout.navSettings') },
  ];

  function handlePoiChange(nextPoiId: string) {
    navigate(`/poi/${nextPoiId}/dashboard`);
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
            <p className="poi-switcher-caption">{t('layout.managing')}</p>
            <PickerRow
              icon={<PinIcon />}
              value={currentPoi?.name ?? ''}
              ariaLabel={`${t('layout.managing')}: ${currentPoi?.name ?? ''}`}
              onClick={() => setPoiPickerOpen(true)}
            />
            <PickerSheet
              open={poiPickerOpen}
              onClose={() => setPoiPickerOpen(false)}
              title={t('layout.choosePlace')}
              options={user.adminPois.map((poi) => ({ key: poi.id, label: poi.name }))}
              selectedKey={poiId ?? ''}
              onChoose={handlePoiChange}
              closeLabel={t('layout.close')}
            />
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
        <Outlet context={{ poiId: poiId!, modules, refreshModules } satisfies DashboardContext} />
      </main>
    </div>
  );
}
