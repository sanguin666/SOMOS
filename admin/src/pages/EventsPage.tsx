import { useEffect, useState, type FormEvent } from 'react';
import { usePoiId } from '../layout/usePoiId';
import { useI18n } from '../i18n/I18nContext';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../api/events';
import type { Event } from '../api/types';
import { DestructiveButton } from '../components/DestructiveButton';

// <input type="datetime-local"> works in the browser's local time and
// wants "YYYY-MM-DDTHH:mm" — this pair converts to/from that and the ISO
// string the API stores.
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInputValue(value: string): string {
  return new Date(value).toISOString();
}

export function EventsPage() {
  const poiId = usePoiId();
  const { t } = useI18n();
  const [items, setItems] = useState<Event[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStartsAt, setEditStartsAt] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');

  function load() {
    getEvents(poiId)
      .then(setItems)
      .catch(() => setError(t('events.loadError')));
  }

  useEffect(load, [poiId]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !startsAt) return;
    setSubmitting(true);
    try {
      const created = await createEvent(poiId, {
        title: title.trim(),
        startsAt: fromLocalInputValue(startsAt),
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      });
      setItems((current) => [...(current ?? []), created].sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
      setTitle('');
      setStartsAt('');
      setLocation('');
      setDescription('');
    } catch {
      setError(t('events.createError'));
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item: Event) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditStartsAt(toLocalInputValue(item.startsAt));
    setEditLocation(item.location ?? '');
    setEditDescription(item.description ?? '');
  }

  async function saveEdit(id: string) {
    try {
      const updated = await updateEvent(poiId, id, {
        title: editTitle.trim(),
        startsAt: editStartsAt ? fromLocalInputValue(editStartsAt) : undefined,
        location: editLocation.trim() || undefined,
        description: editDescription.trim() || undefined,
      });
      setItems(
        (current) =>
          current
            ?.map((e) => (e.id === id ? updated : e))
            .sort((a, b) => a.startsAt.localeCompare(b.startsAt)) ?? null,
      );
      setEditingId(null);
    } catch {
      setError(t('events.saveError'));
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEvent(poiId, id);
      setItems((current) => current?.filter((e) => e.id !== id) ?? null);
    } catch {
      setError(t('events.deleteError'));
    }
  }

  return (
    <div>
      <h2>{t('events.title')}</h2>
      <p className="muted">{t('events.subtitle')}</p>

      <form className="form card" onSubmit={handleCreate}>
        <label>
          {t('events.titleLabel')}
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          {t('events.startsAtLabel')}
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </label>
        <label>
          {t('events.locationLabel')}
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label>
          {t('events.descriptionLabel')}
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={submitting || !title.trim() || !startsAt}>
          {submitting ? t('events.scheduling') : t('events.schedule')}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {items === null && !error && <p className="muted">{t('events.loading')}</p>}
      {items?.length === 0 && !error && <p className="muted">{t('events.empty')}</p>}

      {items?.map((item) =>
        editingId === item.id ? (
          <div key={item.id} className="card form">
            <label>
              {t('events.titleLabel')}
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </label>
            <label>
              {t('events.startsAtLabel')}
              <input
                type="datetime-local"
                value={editStartsAt}
                onChange={(e) => setEditStartsAt(e.target.value)}
              />
            </label>
            <label>
              {t('events.locationLabel')}
              <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
            </label>
            <label>
              {t('events.descriptionLabel')}
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </label>
            <div className="card-actions">
              <button type="button" className="btn btn-primary" onClick={() => saveEdit(item.id)}>
                {t('events.save')}
              </button>
              <button type="button" className="btn" onClick={() => setEditingId(null)}>
                {t('events.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <div key={item.id} className="card">
            <p className="card-title">{item.title}</p>
            <p className="card-meta">
              {new Date(item.startsAt).toLocaleString()}
              {item.location ? ` · ${item.location}` : ''}
            </p>
            {item.description && <p>{item.description}</p>}
            <div className="card-actions">
              <button type="button" className="btn" onClick={() => startEdit(item)}>
                {t('events.edit')}
              </button>
              <DestructiveButton label={t('events.delete')} onConfirm={() => handleDelete(item.id)} />
            </div>
          </div>
        ),
      )}
    </div>
  );
}
