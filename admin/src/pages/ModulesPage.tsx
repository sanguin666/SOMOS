import { useEffect, useState } from 'react';
import { usePoiId } from '../layout/usePoiId';
import { activateModule, getActiveModules, setModuleStatus } from '../api/activeModules';
import type { ActiveModule, ModuleType } from '../api/types';

const ALL_MODULE_TYPES: { type: ModuleType; label: string }[] = [
  { type: 'donations', label: 'Donations' },
  { type: 'events', label: 'Events' },
  { type: 'announcements', label: 'Announcements' },
  { type: 'prayer_requests', label: 'Prayer Requests' },
  { type: 'livestreams', label: 'Livestream' },
  { type: 'community', label: 'Community' },
];

const LIVE_STATUSES = new Set(['trial', 'active']);

export function ModulesPage() {
  const poiId = usePoiId();
  const [modules, setModules] = useState<ActiveModule[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingType, setPendingType] = useState<ModuleType | null>(null);

  function load() {
    getActiveModules(poiId)
      .then(setModules)
      .catch(() => setError('Could not load modules.'));
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
      setError('Could not update this module.');
    } finally {
      setPendingType(null);
    }
  }

  return (
    <div>
      <h2>Modules</h2>
      <p className="muted">Turn features on or off for this parish's app experience.</p>

      {error && <p className="error-text">{error}</p>}
      {modules === null && !error && <p className="muted">Loading…</p>}

      {modules !== null &&
        ALL_MODULE_TYPES.map(({ type, label }) => {
          const existing = modules.find((m) => m.moduleType === type);
          const isLive = existing ? LIVE_STATUSES.has(existing.status) : false;
          return (
            <div key={type} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p className="card-title">{label}</p>
                <span className={`badge ${isLive ? 'badge-active' : ''}`}>
                  {existing ? existing.status : 'not activated'}
                </span>
              </div>
              <button
                type="button"
                className={isLive ? 'btn btn-danger' : 'btn btn-primary'}
                disabled={pendingType === type}
                onClick={() => handleToggle(type, existing)}
              >
                {isLive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          );
        })}
    </div>
  );
}
