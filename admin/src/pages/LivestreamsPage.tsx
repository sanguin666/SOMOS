import { useEffect, useState, type FormEvent } from 'react';
import { usePoiId } from '../layout/usePoiId';
import {
  createLivestream,
  deleteLivestream,
  getLivestreams,
  updateLivestream,
} from '../api/livestreams';
import type { Livestream, LivestreamStatus } from '../api/types';

const STATUS_OPTIONS: LivestreamStatus[] = ['upcoming', 'live', 'ended'];

export function LivestreamsPage() {
  const poiId = usePoiId();
  const [items, setItems] = useState<Livestream[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function load() {
    getLivestreams(poiId)
      .then(setItems)
      .catch(() => setError('Could not load livestreams.'));
  }

  useEffect(load, [poiId]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !url.trim() || !scheduledAt) return;
    setSubmitting(true);
    try {
      const created = await createLivestream(poiId, {
        title: title.trim(),
        url: url.trim(),
        scheduledAt: new Date(scheduledAt).toISOString(),
      });
      setItems((current) =>
        [created, ...(current ?? [])].sort(
          (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
        ),
      );
      setTitle('');
      setUrl('');
      setScheduledAt('');
    } catch {
      setError('Could not schedule the livestream.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(item: Livestream, status: LivestreamStatus) {
    try {
      const updated = await updateLivestream(poiId, item.id, { status });
      setItems((current) => current?.map((s) => (s.id === item.id ? updated : s)) ?? null);
    } catch {
      setError('Could not update the status.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteLivestream(poiId, id);
      setItems((current) => current?.filter((s) => s.id !== id) ?? null);
    } catch {
      setError('Could not delete the livestream.');
    }
  }

  return (
    <div>
      <h2>Livestreams</h2>
      <p className="muted">Schedule a link to a livestreamed or recorded service.</p>

      <form className="form card" onSubmit={handleCreate}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          URL
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            required
          />
        </label>
        <label>
          Scheduled at
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !title.trim() || !url.trim() || !scheduledAt}
        >
          {submitting ? 'Scheduling…' : 'Schedule'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {items === null && !error && <p className="muted">Loading…</p>}

      {items?.map((item) => (
        <div key={item.id} className="card">
          <p className="card-title">{item.title}</p>
          <p>
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.url}
            </a>
          </p>
          <p className="card-meta">{new Date(item.scheduledAt).toLocaleString()}</p>
          <div className="card-actions">
            <select
              value={item.status}
              onChange={(e) => handleStatusChange(item, e.target.value as LivestreamStatus)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
