import type { Donation } from './entities/donation.entity.js';
import type { Poi } from '../pois/entities/poi.entity.js';
import { Language } from '../common/enums/language.enum.js';
import {
  decodeDonorKey,
  donorKey,
  donorsCsv,
  encodeDonorKey,
  groupDonors,
  receiptHtml,
  receiptNumber,
} from './receipts.js';

function gift(overrides: Partial<Donation>): Donation {
  return {
    amount: 10,
    donorName: 'Ana García',
    donorAddress: 'Calle Mayor 1',
    donorPostalCode: '28001',
    donorCity: 'Madrid',
    donorTaxId: null,
    donor: null,
    createdAt: new Date('2026-03-01T10:00:00Z'),
    ...overrides,
  } as Donation;
}

describe('receipts', () => {
  it('knows a giver by tax number first, then account, then name and postcode', () => {
    expect(donorKey(gift({ donorTaxId: '12345678-z', donor: { id: 'u1' } as Donation['donor'] }))).toBe('t:12345678Z');
    expect(donorKey(gift({ donor: { id: 'u1' } as Donation['donor'] }))).toBe('u:u1');
    expect(donorKey(gift({ donorName: '  ana   garcía ' }))).toBe('n:ANA GARCÍA|28001');
  });

  it('round-trips a key through a URL-safe form', () => {
    const key = 'n:ANA GARCÍA|28001';
    const encoded = encodeDonorKey(key);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(decodeDonorKey(encoded)).toBe(key);
  });

  it('adds up a giver’s year, keeping the latest address', () => {
    const [donor, ...rest] = groupDonors([
      gift({ amount: 20.1, donorTaxId: '1A' }),
      gift({ amount: 30.2, donorTaxId: '1A', donorAddress: 'Calle Nueva 2', createdAt: new Date('2026-06-01T10:00:00Z') }),
    ]);
    expect(rest).toHaveLength(0);
    expect(donor).toMatchObject({ total: 50.3, count: 2, address: 'Calle Nueva 2', taxId: '1A' });
  });

  it('gives the same receipt number however often it is printed', () => {
    expect(receiptNumber(2026, 't:1A')).toBe(receiptNumber(2026, 't:1A'));
    expect(receiptNumber(2026, 't:1A')).not.toBe(receiptNumber(2026, 't:1B'));
    expect(receiptNumber(2026, 't:1A')).toMatch(/^2026-[0-9A-F]{8}$/);
  });

  it('writes a spreadsheet Excel opens, with the province from the postcode', () => {
    const csv = donorsCsv(groupDonors([gift({ donorTaxId: '1A', donorName: 'García; Ana' })]));
    expect(csv.startsWith('﻿')).toBe(true);
    const [, row] = csv.slice(1).split('\r\n');
    expect(row).toBe('1A;"García; Ana";Calle Mayor 1;28001;Madrid;28;10.00;1');
  });

  it('escapes what the giver typed, and warns when the community’s details are missing', () => {
    const [donor] = groupDonors([gift({ donorName: '<script>x</script>' })]);
    const poi = { name: 'Santa Ana', language: Language.ES, city: 'Madrid' } as Poi;
    const html = receiptHtml(poi, donor, 2026, 'eur');
    expect(html).not.toContain('<script>x');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('Certificado de donativos 2026');
    expect(html).toContain('Los datos legales de la comunidad');
  });
});
