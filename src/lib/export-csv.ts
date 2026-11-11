/**
 * CSV and Excel export utilities for Edunova Academic Management System.
 * Supports formatted headers, quoted cell strings, and automatic browser download.
 */

export interface CsvColumn<T> {
  key: keyof T | string;
  label: string;
  format?: (value: any, row: T) => string | number;
}

/**
 * Convert tabular dataset into CSV formatted string
 */
export function generateCsvContent<T extends Record<string, any>>(
  rows: T[],
  columns: CsvColumn<T>[]
): string {
  if (!rows || rows.length === 0) {
    return columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(",");
  }

  const headerLine = columns
    .map((c) => `"${c.label.replace(/"/g, '""')}"`)
    .join(",");

  const rowLines = rows.map((row) => {
    return columns
      .map((col) => {
        let val: any;
        if (col.format) {
          val = col.format(row[col.key as keyof T], row);
        } else {
          val = row[col.key as keyof T];
        }

        if (val === null || val === undefined) {
          return '""';
        }

        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      })
      .join(",");
  });

  return [headerLine, ...rowLines].join("\r\n");
}

/**
 * Trigger immediate browser download of CSV data
 */
export function downloadCsvFile(content: string, filename: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.setAttribute(
    "download",
    filename.endsWith(".csv") ? filename : `${filename}.csv`
  );
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Convenience export function: generates CSV and triggers browser download
 */
export function exportToCsv<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  columns: CsvColumn<T>[]
): void {
  const content = generateCsvContent(rows, columns);
  downloadCsvFile(content, filename);
}
