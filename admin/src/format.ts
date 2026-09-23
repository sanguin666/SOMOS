// Must match the backend's DONATION_CURRENCY, which is what Stripe actually
// charges in — see backend/src/donations/stripe.service.ts.
export const CURRENCY = import.meta.env.VITE_DONATION_CURRENCY ?? 'EUR';

const wholeMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 });
const exactMoney = new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 });

// "€20" for a round amount, "€12.50" when there are cents to show.
export function formatMoney(value: number): string {
  return (Number.isInteger(value) ? wholeMoney : exactMoney).format(value);
}

const pad = (n: number) => String(n).padStart(2, '0');

// <input type="datetime-local"> works in the browser's local time and
// wants "YYYY-MM-DDTHH:mm" — this pair converts to/from that and the ISO
// string the API stores.
export function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromLocalInputValue(value: string): string {
  return new Date(value).toISOString();
}

// The same for <input type="date"> ("YYYY-MM-DD"), in local time.
export function toDateInputValue(iso: string): string {
  return toLocalInputValue(iso).slice(0, 10);
}

// A date the user picked, as the ISO string of the end of that day in
// their own time zone, so "until 30 June" still includes the 30th.
export function endOfDayFromDateInput(value: string): string {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59).toISOString();
}
