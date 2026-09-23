import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePoiId } from '../layout/usePoiId';
import { useI18n } from '../i18n/I18nContext';
import { API_BASE_URL } from '../api/client';
import {
  askForDocument,
  getRequest,
  getRequests,
  removeDocument,
  sendRequestMessage,
  setDocumentReceived,
  updateRequest,
  type RequestFilter,
} from '../api/requests';
import type {
  RequestFile,
  ServiceRequestDetail,
  ServiceRequestStatus,
  ServiceRequestSummary,
  ServiceRequestType,
} from '../api/types';
import { DestructiveButton } from '../components/DestructiveButton';
import { fromLocalInputValue, toLocalInputValue } from '../format';

type T = ReturnType<typeof useI18n>['t'];

const STATUSES: ServiceRequestStatus[] = ['received', 'in_progress', 'appointment_set', 'completed', 'cancelled'];

// What the file picker offers — the backend takes a photo or a PDF, up to 10 MB.
const DOCUMENT_ACCEPT = 'application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif';

/** The office's list of requests, still open ones by default. */
export function RequestsPage() {
  const poiId = usePoiId();
  const { t, language } = useI18n();
  const [filter, setFilter] = useState<RequestFilter>('open');
  const [items, setItems] = useState<ServiceRequestSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRequests(poiId, filter)
      .then(setItems)
      .catch(() => setError(t('requests.loadError')));
  }, [poiId, filter]);

  return (
    <div>
      <h2>{t('requests.title')}</h2>
      <p className="muted">{t('requests.subtitle')}</p>

      <p>
        <label>
          {t('requests.filterLabel')}{' '}
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as RequestFilter);
              setItems(null);
              setError(null);
            }}
          >
            <option value="open">{t('requests.filterOpen')}</option>
            <option value="closed">{t('requests.filterClosed')}</option>
            <option value="all">{t('requests.filterAll')}</option>
          </select>
        </label>
      </p>

      {error && <p className="error-text">{error}</p>}
      {items === null && !error && <p className="muted">{t('requests.loading')}</p>}
      {items?.length === 0 && <p className="muted">{t('requests.empty')}</p>}

      {/* One white card, one row per request. */}
      {items !== null && items.length > 0 && (
        <div className="card card-list">
          {items.map((item) => (
            <div key={item.id} className="card-row">
              <div>
                <p className="card-title" style={{ margin: 0 }}>
                  {typeName(item.type, t)} · {item.contactName}
                </p>
                <p className="card-meta">
                  {statusName(item.status, t)} ·{' '}
                  {t('requests.askedOn', { date: new Date(item.createdAt).toLocaleDateString(language) })}
                  {item.appointmentAt &&
                    ` · ${t('requests.appointmentOn', { date: new Date(item.appointmentAt).toLocaleString(language, { dateStyle: 'medium', timeStyle: 'short' }) })}`}
                </p>
                {(item.unread || item.documentsPending > 0) && (
                  <p style={{ margin: '4px 0 0', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {item.unread && <span className="badge badge-active">{t('requests.unread')}</span>}
                    {item.documentsPending > 0 && (
                      <span className="badge">
                        {item.documentsPending === 1
                          ? t('requests.documentsPendingOne')
                          : t('requests.documentsPendingMany', { n: item.documentsPending })}
                      </span>
                    )}
                  </p>
                )}
              </div>
              <Link
                to={item.id}
                className="btn"
                aria-label={`${t('requests.open')}: ${typeName(item.type, t)} · ${item.contactName}`}
              >
                {t('requests.open')}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FileLink({ file }: { file: RequestFile }) {
  const { t } = useI18n();
  return (
    <a href={`${API_BASE_URL}${file.url}`} target="_blank" rel="noreferrer">
      {t('requests.openFile', { name: file.name })}
    </a>
  );
}

/** One request: where it stands, its appointment, papers and conversation. */
export function RequestDetailPage() {
  const poiId = usePoiId();
  const { requestId } = useParams<{ requestId: string }>();
  const { t, language } = useI18n();
  const [request, setRequest] = useState<ServiceRequestDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<ServiceRequestStatus>('received');
  const [appointmentAt, setAppointmentAt] = useState('');
  const [appointmentPlace, setAppointmentPlace] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);

  const [documentLabel, setDocumentLabel] = useState('');
  const [documentNote, setDocumentNote] = useState('');
  const [asking, setAsking] = useState(false);

  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  // Changing the key empties the file input after a message is sent.
  const [fileInputKey, setFileInputKey] = useState(0);
  const [sending, setSending] = useState(false);

  // Every call answers with the whole request, fresh signed links included.
  function adopt(next: ServiceRequestDetail) {
    setRequest(next);
    setStatus(next.status);
    setAppointmentAt(next.appointmentAt ? toLocalInputValue(next.appointmentAt) : '');
    setAppointmentPlace(next.appointmentPlace ?? '');
  }

  useEffect(() => {
    if (!requestId) return;
    getRequest(poiId, requestId)
      .then(adopt)
      .catch(() => setError(t('requests.loadOneError')));
  }, [poiId, requestId]);

  if (!request) {
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Link to=".." relative="path" className="btn">
            ← {t('requests.backToList')}
          </Link>
        </div>
        {error ? <p className="error-text">{error}</p> : <p className="muted">{t('requests.loading')}</p>}
      </div>
    );
  }

  const id = request.id;
  const savedAppointment = request.appointmentAt ? toLocalInputValue(request.appointmentAt) : '';
  const statusDirty =
    status !== request.status ||
    appointmentAt !== savedAppointment ||
    appointmentPlace.trim() !== (request.appointmentPlace ?? '');

  // Only what changed is sent, so setting a date on its own lets the
  // server move the request to "appointment set" by itself.
  async function saveStatus() {
    if (!request) return;
    setSavingStatus(true);
    setStatusSaved(false);
    setError(null);
    try {
      adopt(
        await updateRequest(poiId, id, {
          ...(status !== request.status ? { status } : {}),
          ...(appointmentAt !== savedAppointment
            ? { appointmentAt: appointmentAt ? fromLocalInputValue(appointmentAt) : null }
            : {}),
          ...(appointmentPlace.trim() !== (request.appointmentPlace ?? '')
            ? { appointmentPlace: appointmentPlace.trim() || null }
            : {}),
        }),
      );
      setStatusSaved(true);
    } catch {
      setError(t('requests.saveError'));
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleAsk(event: FormEvent) {
    event.preventDefault();
    if (!documentLabel.trim()) return;
    setAsking(true);
    setError(null);
    try {
      adopt(
        await askForDocument(poiId, id, {
          label: documentLabel.trim(),
          note: documentNote.trim() || undefined,
        }),
      );
      setDocumentLabel('');
      setDocumentNote('');
    } catch {
      setError(t('requests.documentError'));
    } finally {
      setAsking(false);
    }
  }

  async function toggleReceived(documentId: string, received: boolean) {
    setError(null);
    try {
      adopt(await setDocumentReceived(poiId, id, documentId, received));
    } catch {
      setError(t('requests.documentError'));
    }
  }

  async function handleRemoveDocument(documentId: string) {
    setError(null);
    try {
      adopt(await removeDocument(poiId, id, documentId));
    } catch {
      setError(t('requests.documentError'));
    }
  }

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!message.trim() && !attachment) return;
    setSending(true);
    setError(null);
    try {
      adopt(await sendRequestMessage(poiId, id, message.trim(), attachment));
      setMessage('');
      setAttachment(null);
      setFileInputKey((k) => k + 1);
    } catch {
      setError(t('requests.sendError'));
    } finally {
      setSending(false);
    }
  }

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString(language, { dateStyle: 'medium', timeStyle: 'short' });
  const accountName = [request.requester?.firstName, request.requester?.lastName].filter(Boolean).join(' ');

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to=".." relative="path" className="btn">
          ← {t('requests.backToList')}
        </Link>
      </div>
      <h2>
        {typeName(request.type, t)} · {request.contactName}
      </h2>
      <p className="muted">
        {statusName(request.status, t)} ·{' '}
        {t('requests.askedOn', { date: new Date(request.createdAt).toLocaleDateString(language) })}
      </p>

      {error && <p className="error-text">{error}</p>}

      <div className="card form">
        <div className="form-row">
          {t('requests.contactLabel')}
          <span className="form-row-value">
            {request.contactName}
            {request.contactPhone ? ` · ${request.contactPhone}` : ''}
          </span>
        </div>
        {request.requester && (
          <div className="form-row">
            {t('requests.accountLabel')}
            <span className="form-row-value">
              {accountName || t('requests.noName')}
              {request.requester.phone ? ` · ${request.requester.phone}` : ''}
            </span>
          </div>
        )}
        {request.preferredDate && (
          <div className="form-row">
            {t('requests.preferredDateLabel')}
            <span className="form-row-value">{request.preferredDate}</span>
          </div>
        )}
        <div className="form-row">
          {t('requests.detailsLabel')}
          <span className="form-row-value">{request.details}</span>
        </div>
      </div>

      <h3>{t('requests.statusHeading')}</h3>
      <div className="card form">
        <label>
          {t('requests.statusLabel')}
          <select value={status} onChange={(e) => setStatus(e.target.value as ServiceRequestStatus)}>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {statusName(value, t)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('requests.appointmentAtLabel')}
          <input type="datetime-local" value={appointmentAt} onChange={(e) => setAppointmentAt(e.target.value)} />
        </label>
        <label>
          {t('requests.appointmentPlaceLabel')}
          <input
            value={appointmentPlace}
            onChange={(e) => setAppointmentPlace(e.target.value)}
            placeholder={t('requests.appointmentPlacePlaceholder')}
          />
        </label>
        <div className="card-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={savingStatus || !statusDirty}
            onClick={saveStatus}
          >
            {savingStatus ? t('requests.saving') : t('requests.save')}
          </button>
          {statusSaved && !statusDirty && <span className="muted">{t('requests.saved')}</span>}
        </div>
        <p className="muted" style={{ fontSize: 15 }}>
          {t('requests.statusHint')}
        </p>
      </div>

      <h3>{t('requests.documentsHeading')}</h3>
      <div className="card">
        {request.documents.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            {t('requests.noDocuments')}
          </p>
        ) : (
          <ul className="card-rows" style={{ marginTop: 0 }}>
            {request.documents.map((document) => (
              <li key={document.id} className="card-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div>
                  <p className="card-title" style={{ margin: 0 }}>
                    {document.label}
                  </p>
                  {document.note && <p className="card-meta">{document.note}</p>}
                  <span className={`badge ${document.receivedAt ? 'badge-active' : ''}`}>
                    {document.receivedAt
                      ? t('requests.receivedOn', { date: new Date(document.receivedAt).toLocaleDateString(language) })
                      : t('requests.awaited')}
                  </span>
                  {document.file && (
                    <p style={{ margin: '4px 0 0' }}>
                      <FileLink file={document.file} />
                    </p>
                  )}
                </div>
                <div className="card-actions" style={{ marginTop: 0 }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => toggleReceived(document.id, !document.receivedAt)}
                  >
                    {document.receivedAt ? t('requests.markNotReceived') : t('requests.markReceived')}
                  </button>
                  <DestructiveButton
                    label={t('requests.removeDocument')}
                    onConfirm={() => handleRemoveDocument(document.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        <form className="form form-after-rows" onSubmit={handleAsk}>
          <p className="card-title" style={{ margin: '12px 0 0' }}>
            {t('requests.askHeading')}
          </p>
          <label>
            {t('requests.documentLabel')}
            <input
              value={documentLabel}
              onChange={(e) => setDocumentLabel(e.target.value)}
              placeholder={t('requests.documentPlaceholder')}
              required
            />
          </label>
          <label>
            {t('requests.documentNoteLabel')}
            <input value={documentNote} onChange={(e) => setDocumentNote(e.target.value)} />
          </label>
          <div className="card-actions">
            <button type="submit" className="btn btn-primary" disabled={asking || !documentLabel.trim()}>
              {asking ? t('requests.asking') : t('requests.ask')}
            </button>
          </div>
        </form>
      </div>

      <h3>{t('requests.conversationHeading')}</h3>
      <div className="card">
        {request.messages.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            {t('requests.noMessages')}
          </p>
        ) : (
          <ul className="card-rows" style={{ marginTop: 0 }} aria-label={t('requests.conversationHeading')}>
            {request.messages.map((m) => (
              <li key={m.id} className="card-row" style={{ display: 'block' }}>
                <p style={{ margin: 0, fontWeight: 700 }} className={m.fromStaff ? 'badge-active' : undefined}>
                  {m.fromStaff
                    ? t('requests.fromOffice', { name: m.authorName ?? t('requests.office') })
                    : (m.authorName ?? request.contactName)}
                </p>
                {m.body && <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>{m.body}</p>}
                {m.attachment && (
                  <p style={{ margin: '4px 0 0' }}>
                    <FileLink file={m.attachment} />
                  </p>
                )}
                <p className="card-meta">{formatDateTime(m.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}

        <form className="form form-after-rows" onSubmit={handleSend}>
          <label>
            {t('requests.messageLabel')}
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <label>
            {t('requests.attachmentLabel')}
            <input
              key={fileInputKey}
              type="file"
              accept={DOCUMENT_ACCEPT}
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
          </label>
          <div className="card-actions">
            <button type="submit" className="btn btn-primary" disabled={sending || (!message.trim() && !attachment)}>
              {sending ? t('requests.sending') : t('requests.send')}
            </button>
          </div>
          <p className="muted" style={{ fontSize: 15 }}>
            {t('requests.sendHint')}
          </p>
        </form>
      </div>
    </div>
  );
}

function statusName(status: ServiceRequestStatus, t: T): string {
  switch (status) {
    case 'received':
      return t('requests.statusReceived');
    case 'in_progress':
      return t('requests.statusInProgress');
    case 'appointment_set':
      return t('requests.statusAppointmentSet');
    case 'completed':
      return t('requests.statusCompleted');
    case 'cancelled':
      return t('requests.statusCancelled');
  }
}

function typeName(type: ServiceRequestType, t: T): string {
  switch (type) {
    case 'baptism':
      return t('requests.typeBaptism');
    case 'wedding':
      return t('requests.typeWedding');
    case 'funeral':
      return t('requests.typeFuneral');
    case 'first_communion':
      return t('requests.typeFirstCommunion');
    case 'confirmation':
      return t('requests.typeConfirmation');
    case 'certificate':
      return t('requests.typeCertificate');
    case 'meeting':
      return t('requests.typeMeeting');
    case 'blessing':
      return t('requests.typeBlessing');
    case 'sick_visit':
      return t('requests.typeSickVisit');
    case 'other':
      return t('requests.typeOther');
  }
}
