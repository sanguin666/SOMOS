import { useEffect, useState, type FormEvent } from 'react';
import { usePoiId } from '../layout/usePoiId';
import { useI18n } from '../i18n/I18nContext';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from '../api/announcements';
import type { Announcement } from '../api/types';

export function AnnouncementsPage() {
  const poiId = usePoiId();
  const { t } = useI18n();
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
      .catch(() => setError(t('announcements.loadError')));
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
      setError(t('announcements.createError'));
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
      setError(t('announcements.saveError'));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAnnouncement(poiId, id);
      setItems((current) => current?.filter((a) => a.id !== id) ?? null);
    } catch {
      setError(t('announcements.deleteError'));
    }
  }

  return (
    <div>
      <h2>{t('announcements.title')}</h2>
      <p className="muted">{t('announcements.subtitle')}</p>

      <form className="form card" onSubmit={handleCreate}>
        <label>
          {t('announcements.titleLabel')}
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          {t('announcements.bodyLabel')}
          <textarea value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={submitting || !title.trim()}>
          {submitting ? t('announcements.publishing') : t('announcements.publish')}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {items === null && !error && <p className="muted">{t('announcements.loading')}</p>}

      {items?.map((item) =>
        editingId === item.id ? (
          <div key={item.id} className="card form">
            <label>
              {t('announcements.titleLabel')}
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </label>
            <label>
              {t('announcements.bodyLabel')}
              <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} />
            </label>
            <div className="card-actions">
              <button type="button" className="btn btn-primary" onClick={() => saveEdit(item.id)}>
                {t('announcements.save')}
              </button>
              <button type="button" className="btn" onClick={() => setEditingId(null)}>
                {t('announcements.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <div key={item.id} className="card">
            <p className="card-title">{item.title}</p>
            {item.body && <p>{item.body}</p>}
            {item.audioUrl && <p className="muted">{t('announcements.includesVoice')}</p>}
            <p className="card-meta">{new Date(item.createdAt).toLocaleString()}</p>
            <div className="card-actions">
              <button type="button" className="btn" onClick={() => startEdit(item)}>
                {t('announcements.edit')}
              </button>
              <button type="button" className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                {t('announcements.delete')}
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
