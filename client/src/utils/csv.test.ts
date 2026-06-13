import { describe, it, expect } from 'vitest';
import { toCsv } from './csv';

describe('toCsv', () => {
  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'country' as const, label: 'Country' },
  ];

  it('builds a header and rows', () => {
    const csv = toCsv([{ name: 'Acme', country: 'Türkiye' }], columns);
    expect(csv).toBe('Name,Country\nAcme,Türkiye');
  });

  it('escapes values containing commas and quotes', () => {
    const csv = toCsv([{ name: 'Acme, Inc', country: 'a "b"' }], columns);
    expect(csv).toBe('Name,Country\n"Acme, Inc","a ""b"""');
  });

  it('renders empty cells for null/undefined values', () => {
    const csv = toCsv([{ name: null, country: undefined }], columns);
    expect(csv).toBe('Name,Country\n,');
  });
});
