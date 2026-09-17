import { useEffect, useState } from 'react';
import { usePoiId } from '../layout/usePoiId';
import { deletePrayerRequest, getPrayerRequests } from '../api/prayerRequests';
import type { PrayerRequest } from '../api/types';

export function PrayerRequestsPage() {
  const poiId = usePoiId();
  const [items, setItems] = useState<PrayerRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    getPrayerRequests(poiId)
      .then(setItems)
      .catch(() => setError('Could not load prayer requests.'));
  }

  useEffect(load, [poiId]);

  async function handleDelete(id: string) {
    try {
      await deletePrayerRequest(poiId, id);
      setItems((current) => current?.filter((r) => r.id !== id) ?? null);
    } catch {
      setError('Could not remove that request.');
    }
  }

  return (
    <div>
      <h2>Prayer Requests</h2>
      <p className="muted">Moderate what's shared publicly. Anyone can post here from the app.</p>

      {error && <p className="error-text">{error}</p>}
      {items === null && !error && <p className="muted">Loading…</p>}
      {items?.length === 0 && <p className="muted">No prayer requests yet.</p>}

      {items?.map((item) => (
        <div key={item.id} className="card">
          <p>{item.message}</p>
          <p className="card-meta">
            — {item.authorName ?? 'Anonymous'} · {item.prayerCount} praying ·{' '}
            {new Date(item.createdAt).toLocaleString()}
          </p>
          <div className="card-actions">
            <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
