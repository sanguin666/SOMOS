import type { ReactNode } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardLayout } from './layout/DashboardLayout';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { LivestreamsPage } from './pages/LivestreamsPage';
import { PrayerRequestsPage } from './pages/PrayerRequestsPage';
import { CommunityPage } from './pages/CommunityPage';
import { ModulesPage } from './pages/ModulesPage';

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Home() {
  const { user } = useAuth();
  if (!user) return null;
  const firstPoi = user.adminPois[0];
  if (!firstPoi) {
    return (
      <div style={{ padding: 32 }}>
        <p>Your account isn't an admin of any parish yet.</p>
      </div>
    );
  }
  return <Navigate to={`/poi/${firstPoi.id}/announcements`} replace />;
}

function PoiIndexRedirect() {
  const { poiId } = useParams<{ poiId: string }>();
  return <Navigate to={`/poi/${poiId}/announcements`} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route
        path="/poi/:poiId"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<PoiIndexRedirect />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="livestreams" element={<LivestreamsPage />} />
        <Route path="prayer-requests" element={<PrayerRequestsPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="modules" element={<ModulesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
