const escapeCell = (value: unknown) => {
  const str = value == null ? '' : String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

/** Builds a CSV string from rows and column definitions (pure, testable). */
export function toCsv<T>(
  rows: T[],
  columns: { key: keyof T; label: string }[]
): string {
  const header = columns.map((c) => escapeCell(c.label)).join(',');
  const body = rows
    .map((row) => columns.map((c) => escapeCell(row[c.key])).join(','))
    .join('\n');
  return `${header}\n${body}`;
}

/** Exports an array of records to a downloadable CSV file. */
export function exportToCsv<T>(
  filename: string,
  rows: T[],
  columns: { key: keyof T; label: string }[]
) {
  const blob = new Blob([toCsv(rows, columns)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
