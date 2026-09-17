import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const NAV_ITEMS = [
  { to: 'announcements', label: 'Announcements' },
  { to: 'livestreams', label: 'Livestreams' },
  { to: 'prayer-requests', label: 'Prayer Requests' },
  { to: 'community', label: 'Community' },
  { to: 'modules', label: 'Modules' },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { poiId } = useParams<{ poiId: string }>();

  if (!user) return null;

  const currentPoi = user.adminPois.find((p) => p.id === poiId);

  function handlePoiChange(nextPoiId: string) {
    navigate(`/poi/${nextPoiId}/announcements`);
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>myPeople Admin</h1>
          <p className="muted" style={{ fontSize: 13, margin: 0 }}>
            {user.firstName ?? user.email}
          </p>
        </div>

        {user.adminPois.length > 1 ? (
          <div className="poi-switcher">
            <label htmlFor="poi-select" style={{ fontSize: 13, fontWeight: 600 }}>
              Managing
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
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="btn" onClick={logout} style={{ width: '100%' }}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet context={{ poiId: poiId! }} />
      </main>
    </div>
  );
}
