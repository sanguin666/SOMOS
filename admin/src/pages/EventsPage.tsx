import { useEffect, useState, type FormEvent } from 'react';
import { usePoiId } from '../layout/usePoiId';
import { useI18n } from '../i18n/I18nContext';
import { createEvent, deleteEvent, getEvents, updateEvent, type EventInput } from '../api/events';
import type { Event, EventCategory, EventRecurrence } from '../api/types';
import { DestructiveButton } from '../components/DestructiveButton';
import {
  endOfDayFromDateInput,
  fromLocalInputValue,
  toDateInputValue,
  toLocalInputValue,
} from '../format';

const CATEGORIES: EventCategory[] = ['mass', 'confession', 'adoration', 'prayer', 'office_hours', 'other'];

// What the form holds, in the shapes the inputs want: local
// "YYYY-MM-DDTHH:mm" for the start, "HH:mm" for the end (the same day),
// "YYYY-MM-DD" for the last day of a weekly event.
type Draft = {
  title: string;
  category: EventCategory;
  startsAt: string;
  endTime: string;
  recurrence: EventRecurrence;
  repeatUntil: string;
  location: string;
  description: string;
};

const EMPTY_DRAFT: Draft = {
  title: '',
  category: 'other',
  startsAt: '',
  endTime: '',
  recurrence: 'none',
  repeatUntil: '',
  location: '',
  description: '',
};

function draftFrom(item: Event): Draft {
  return {
    title: item.title,
    category: item.category,
    startsAt: toLocalInputValue(item.startsAt),
    endTime: item.endsAt ? toLocalInputValue(item.endsAt).slice(11) : '',
    recurrence: item.recurrence,
    repeatUntil: item.repeatUntil ? toDateInputValue(item.repeatUntil) : '',
    location: item.location ?? '',
    description: item.description ?? '',
  };
}

// The end is asked as a time on the start's day; one earlier than the
// start (a vigil until 1:00) is taken to be the next morning.
function endsAtFrom(draft: Draft): string | null {
  if (!draft.endTime || !draft.startsAt) return null;
  const end = new Date(`${draft.startsAt.slice(0, 10)}T${draft.endTime}`);
  if (end <= new Date(draft.startsAt)) end.setDate(end.getDate() + 1);
  return end.toISOString();
}

// null clears endsAt / repeatUntil, which is what an edit wants when a
// field was emptied; a new event simply has none.
function inputFrom(draft: Draft): EventInput {
  return {
    title: draft.title.trim(),
    startsAt: fromLocalInputValue(draft.startsAt),
    endsAt: endsAtFrom(draft),
    location: draft.location.trim(),
    description: draft.description.trim(),
    category: draft.category,
    recurrence: draft.recurrence,
    repeatUntil:
      draft.recurrence === 'weekly' && draft.repeatUntil ? endOfDayFromDateInput(draft.repeatUntil) : null,
  };
}

// Weekly events in the order of the week (Monday first), then by time.
function weekOrder(item: Event): number {
  const d = new Date(item.startsAt);
  return ((d.getDay() + 6) % 7) * 24 * 60 + d.getHours() * 60 + d.getMinutes();
}

function EventFields({ draft, onChange }: { draft: Draft; onChange: (patch: Partial<Draft>) => void }) {
  const { t } = useI18n();
  const weekly = draft.recurrence === 'weekly';
  return (
    <>
      <label>
        {t('events.titleLabel')}
        <input value={draft.title} onChange={(e) => onChange({ title: e.target.value })} required />
      </label>
      <label>
        {t('events.categoryLabel')}
        <select value={draft.category} onChange={(e) => onChange({ category: e.target.value as EventCategory })}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {categoryName(category, t)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t('events.recurrenceLabel')}
        <select
          value={draft.recurrence}
          onChange={(e) => onChange({ recurrence: e.target.value as EventRecurrence })}
        >
          <option value="none">{t('events.recurrenceNone')}</option>
          <option value="weekly">{t('events.recurrenceWeekly')}</option>
        </select>
      </label>
      <label>
        {weekly ? t('events.firstStartsAtLabel') : t('events.startsAtLabel')}
        <input
          type="datetime-local"
          value={draft.startsAt}
          onChange={(e) => onChange({ startsAt: e.target.value })}
          required
        />
      </label>
      <label>
        {t('events.endTimeLabel')}
        <input type="time" value={draft.endTime} onChange={(e) => onChange({ endTime: e.target.value })} />
      </label>
      {weekly && (
        <label>
          {t('events.repeatUntilLabel')}
          <input
            type="date"
            value={draft.repeatUntil}
            min={draft.startsAt.slice(0, 10) || undefined}
            onChange={(e) => onChange({ repeatUntil: e.target.value })}
          />
        </label>
      )}
      <label>
        {t('events.locationLabel')}
        <input value={draft.location} onChange={(e) => onChange({ location: e.target.value })} />
      </label>
      <label>
        {t('events.descriptionLabel')}
        <textarea value={draft.description} onChange={(e) => onChange({ description: e.target.value })} />
      </label>
    </>
  );
}

export function EventsPage() {
  const poiId = usePoiId();
  const { t, language } = useI18n();
  const [items, setItems] = useState<Event[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY_DRAFT);

  function load() {
    getEvents(poiId)
      .then(setItems)
      .catch(() => setError(t('events.loadError')));
  }

  useEffect(load, [poiId]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.startsAt) return;
    setSubmitting(true);
    try {
      const input = inputFrom(draft);
      const created = await createEvent(poiId, {
        ...input,
        location: input.location || undefined,
        description: input.description || undefined,
      });
      setItems((current) => [...(current ?? []), created].sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
      setDraft(EMPTY_DRAFT);
    } catch {
      setError(t('events.createError'));
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item: Event) {
    setEditingId(item.id);
    setEditDraft(draftFrom(item));
  }

  async function saveEdit(id: string) {
    if (!editDraft.title.trim() || !editDraft.startsAt) return;
    try {
      const updated = await updateEvent(poiId, id, inputFrom(editDraft));
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

  function timeOf(iso: string) {
    return new Date(iso).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' });
  }

  function dateOf(iso: string) {
    return new Date(iso).toLocaleDateString(language, { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // "Every Sunday · 10:30 – 11:30 · until 30 June 2027", or the date of a
  // one-off event, then where.
  function whenLine(item: Event): string {
    const end = item.endsAt ? ` – ${timeOf(item.endsAt)}` : '';
    const parts =
      item.recurrence === 'weekly'
        ? [
            t('events.everyWeekday', {
              day: new Date(item.startsAt).toLocaleDateString(language, { weekday: 'long' }),
            }),
            `${timeOf(item.startsAt)}${end}`,
            new Date(item.startsAt) > new Date() ? t('events.fromDate', { date: dateOf(item.startsAt) }) : null,
            item.repeatUntil ? t('events.untilDate', { date: dateOf(item.repeatUntil) }) : null,
          ]
        : [`${dateOf(item.startsAt)}, ${timeOf(item.startsAt)}${end}`];
    return [...parts, item.location].filter(Boolean).join(' · ');
  }

  function renderItem(item: Event) {
    if (editingId === item.id) {
      return (
        <div key={item.id} className="card form">
          <EventFields draft={editDraft} onChange={(patch) => setEditDraft((d) => ({ ...d, ...patch }))} />
          <div className="card-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!editDraft.title.trim() || !editDraft.startsAt}
              onClick={() => saveEdit(item.id)}
            >
              {t('events.save')}
            </button>
            <button type="button" className="btn" onClick={() => setEditingId(null)}>
              {t('events.cancel')}
            </button>
          </div>
        </div>
      );
    }
    return (
      <div key={item.id} className="card">
        <p className="card-title">{item.title}</p>
        {item.category !== 'other' && <span className="badge">{categoryName(item.category, t)}</span>}
        <p className="card-meta">{whenLine(item)}</p>
        {item.description && <p>{item.description}</p>}
        <div className="card-actions">
          <button type="button" className="btn" onClick={() => startEdit(item)}>
            {t('events.edit')}
          </button>
          <DestructiveButton label={t('events.delete')} onConfirm={() => handleDelete(item.id)} />
        </div>
      </div>
    );
  }

  const weekly = items?.filter((e) => e.recurrence === 'weekly').sort((a, b) => weekOrder(a) - weekOrder(b)) ?? [];
  const once = items?.filter((e) => e.recurrence !== 'weekly') ?? [];

  return (
    <div>
      <h2>{t('events.title')}</h2>
      <p className="muted">{t('events.subtitle')}</p>

      <form className="form card" onSubmit={handleCreate}>
        <EventFields draft={draft} onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))} />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !draft.title.trim() || !draft.startsAt}
        >
          {submitting ? t('events.scheduling') : t('events.schedule')}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {items === null && !error && <p className="muted">{t('events.loading')}</p>}
      {items?.length === 0 && !error && <p className="muted">{t('events.empty')}</p>}

      {weekly.length > 0 && (
        <>
          <h3>{t('events.weeklyHeading')}</h3>
          <p className="muted">{t('events.weeklyHint')}</p>
          {weekly.map(renderItem)}
        </>
      )}

      {once.length > 0 && (
        <>
          {weekly.length > 0 && <h3>{t('events.onceHeading')}</h3>}
          {once.map(renderItem)}
        </>
      )}
    </div>
  );
}

function categoryName(category: EventCategory, t: ReturnType<typeof useI18n>['t']): string {
  switch (category) {
    case 'mass':
      return t('events.categoryMass');
    case 'confession':
      return t('events.categoryConfession');
    case 'adoration':
      return t('events.categoryAdoration');
    case 'prayer':
      return t('events.categoryPrayer');
    case 'office_hours':
      return t('events.categoryOfficeHours');
    case 'other':
      return t('events.categoryOther');
  }
}
