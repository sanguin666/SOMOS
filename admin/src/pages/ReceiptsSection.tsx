import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { API_BASE_URL } from '../api/client';
import { getReceipts } from '../api/donations';
import { getPoi } from '../api/pois';
import { updateReceiptSettings } from '../api/poiSettings';
import type { ReceiptList } from '../api/types';
import { formatMoney } from '../format';

// Receipts are for a calendar year; the office mostly wants last year's
// in January and this year's for someone asking mid-year.
const YEARS_BACK = 5;

type Legal = { legalName: string; legalTaxId: string; legalAddress: string; receiptSignatory: string };

const EMPTY_LEGAL: Legal = { legalName: '', legalTaxId: '', legalAddress: '', receiptSignatory: '' };

/**
 * Yearly tax receipts, on the Donations page: who issues them, and one
 * receipt per giver who asked for one, with the year's list as a CSV for
 * the treasurer. The links are signed and last an hour, so they are
 * fetched again whenever the year changes.
 */
export function ReceiptsSection({ poiId }: { poiId: string }) {
  const { t } = useI18n();
  const thisYear = new Date().getFullYear();
  const [year, setYear] = useState(thisYear);
  const [list, setList] = useState<ReceiptList | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [legal, setLegal] = useState<Legal | null>(null);
  const [savedLegal, setSavedLegal] = useState<Legal>(EMPTY_LEGAL);
  const [savingLegal, setSavingLegal] = useState(false);
  const [legalSaved, setLegalSaved] = useState(false);
  const [legalError, setLegalError] = useState<string | null>(null);

  useEffect(() => {
    getReceipts(poiId, year)
      .then(setList)
      .catch(() => setError(t('receipts.loadError')));
  }, [poiId, year]);

  useEffect(() => {
    getPoi(poiId)
      .then((poi) => {
        const loaded = {
          legalName: poi.legalName ?? '',
          legalTaxId: poi.legalTaxId ?? '',
          legalAddress: poi.legalAddress ?? '',
          receiptSignatory: poi.receiptSignatory ?? '',
        };
        setLegal(loaded);
        setSavedLegal(loaded);
      })
      .catch(() => setLegalError(t('receipts.legalLoadError')));
  }, [poiId]);

  async function saveLegal() {
    if (!legal) return;
    setSavingLegal(true);
    setLegalSaved(false);
    setLegalError(null);
    try {
      const poi = await updateReceiptSettings(poiId, {
        legalName: legal.legalName.trim(),
        legalTaxId: legal.legalTaxId.trim(),
        legalAddress: legal.legalAddress.trim(),
        receiptSignatory: legal.receiptSignatory.trim(),
      });
      const saved = {
        legalName: poi.legalName ?? '',
        legalTaxId: poi.legalTaxId ?? '',
        legalAddress: poi.legalAddress ?? '',
        receiptSignatory: poi.receiptSignatory ?? '',
      };
      setLegal(saved);
      setSavedLegal(saved);
      setLegalSaved(true);
    } catch {
      setLegalError(t('receipts.legalSaveError'));
    } finally {
      setSavingLegal(false);
    }
  }

  const legalDirty =
    !!legal && (Object.keys(EMPTY_LEGAL) as (keyof Legal)[]).some((k) => legal[k].trim() !== savedLegal[k]);
  const years = Array.from({ length: YEARS_BACK + 1 }, (_, i) => thisYear - i);

  return (
    <section aria-labelledby="receipts-heading">
      <h3 id="receipts-heading" style={{ marginTop: 32 }}>
        {t('receipts.title')}
      </h3>
      <p className="muted">{t('receipts.subtitle')}</p>

      {legal && (
        <div className="card form">
          <p className="card-title" style={{ margin: '12px 0 0' }}>
            {t('receipts.legalTitle')}
          </p>
          <p className="muted" style={{ margin: '4px 0 0' }}>
            {t('receipts.legalHint')}
          </p>
          <label>
            {t('receipts.legalNameLabel')}
            <input value={legal.legalName} onChange={(e) => setLegal({ ...legal, legalName: e.target.value })} />
          </label>
          <label>
            {t('receipts.legalTaxIdLabel')}
            <input value={legal.legalTaxId} onChange={(e) => setLegal({ ...legal, legalTaxId: e.target.value })} />
          </label>
          <label>
            {t('receipts.legalAddressLabel')}
            <textarea
              rows={3}
              value={legal.legalAddress}
              onChange={(e) => setLegal({ ...legal, legalAddress: e.target.value })}
            />
          </label>
          <label>
            {t('receipts.signatoryLabel')}
            <input
              value={legal.receiptSignatory}
              onChange={(e) => setLegal({ ...legal, receiptSignatory: e.target.value })}
              placeholder={t('receipts.signatoryPlaceholder')}
            />
          </label>
          <div className="card-actions">
            <button type="button" className="btn btn-primary" disabled={savingLegal || !legalDirty} onClick={saveLegal}>
              {savingLegal ? t('receipts.saving') : t('receipts.save')}
            </button>
            {legalSaved && !legalDirty && <span className="muted">{t('receipts.saved')}</span>}
          </div>
        </div>
      )}
      {legalError && <p className="error-text">{legalError}</p>}

      <div className="card-actions" style={{ marginTop: 0, marginBottom: 16, justifyContent: 'space-between' }}>
        <label>
          {t('receipts.yearLabel')}{' '}
          <select
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));
              setList(null);
              setError(null);
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        {list && list.donors.length > 0 && (
          <a className="btn" href={`${API_BASE_URL}${list.exportUrl}`} download={`donors-${list.year}.csv`}>
            {t('receipts.exportCsv')}
          </a>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
      {list === null && !error && <p className="muted">{t('receipts.loading')}</p>}
      {list?.donors.length === 0 && <p className="muted">{t('receipts.empty', { year: list.year })}</p>}

      {/* One white card, one row per giver. */}
      {list && list.donors.length > 0 && (
        <div className="card card-list">
          {list.donors.map((donor) => (
            <div key={donor.key} className="card-row">
              <div>
                <p className="card-title" style={{ margin: 0 }}>
                  {donor.name || t('receipts.noName')}
                </p>
                <p className="card-meta">
                  {[
                    donor.taxId,
                    [donor.postalCode, donor.city].filter(Boolean).join(' '),
                    donor.count === 1 ? t('receipts.giftCountOne') : t('receipts.giftCountMany', { n: donor.count }),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
              <div className="card-actions" style={{ marginTop: 0, flexShrink: 0 }}>
                <span className="donation-amount">{formatMoney(donor.total)}</span>
                <a
                  className="btn"
                  href={`${API_BASE_URL}${donor.url}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${t('receipts.openReceipt')}: ${donor.name}`}
                >
                  {t('receipts.openReceipt')}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
