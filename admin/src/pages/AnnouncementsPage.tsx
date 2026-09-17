import { useEffect, useState, type FormEvent } from 'react';
import { usePoiId } from '../layout/usePoiId';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from '../api/announcements';
import type { Announcement } from '../api/types';

export function AnnouncementsPage() {
  const poiId = usePoiId();
  const [items, setItems] = useState<Announcement[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  function load() {
    getAnnouncements(poiId)
      .then(setItems)
      .catch(() => setError('Could not load announcements.'));
  }

  useEffect(load, [poiId]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const created = await createAnnouncement(poiId, {
        title: title.trim(),
        body: body.trim() || undefined,
      });
      setItems((current) => [created, ...(current ?? [])]);
      setTitle('');
      setBody('');
    } catch {
      setError('Could not create the announcement.');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item: Announcement) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditBody(item.body ?? '');
  }

  async function saveEdit(id: string) {
    try {
      const updated = await updateAnnouncement(poiId, id, {
        title: editTitle.trim(),
        body: editBody.trim() || undefined,
      });
      setItems((current) => current?.map((a) => (a.id === id ? updated : a)) ?? null);
      setEditingId(null);
    } catch {
      setError('Could not save changes.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAnnouncement(poiId, id);
      setItems((current) => current?.filter((a) => a.id !== id) ?? null);
    } catch {
      setError('Could not delete the announcement.');
    }
  }

  return (
    <div>
      <h2>Announcements</h2>
      <p className="muted">Post bulletin-style updates for this parish.</p>

      <form className="form card" onSubmit={handleCreate}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Body
          <textarea value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={submitting || !title.trim()}>
          {submitting ? 'Publishing…' : 'Publish'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {items === null && !error && <p className="muted">Loading…</p>}

      {items?.map((item) =>
        editingId === item.id ? (
          <div key={item.id} className="card form">
            <label>
              Title
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </label>
            <label>
              Body
              <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} />
            </label>
            <div className="card-actions">
              <button type="button" className="btn btn-primary" onClick={() => saveEdit(item.id)}>
                Save
              </button>
              <button type="button" className="btn" onClick={() => setEditingId(null)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div key={item.id} className="card">
            <p className="card-title">{item.title}</p>
            {item.body && <p>{item.body}</p>}
            {item.audioUrl && <p className="muted">🎙 Includes a voice message</p>}
            <p className="card-meta">{new Date(item.createdAt).toLocaleString()}</p>
            <div className="card-actions">
              <button type="button" className="btn" onClick={() => startEdit(item)}>
                Edit
              </button>
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
