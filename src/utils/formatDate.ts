/**
 * Safely parse an API datetime string into a JavaScript Date object.
 *
 * Backend stores dates in UTC in SQL Server `datetime2` and serializes them
 * as ISO strings without a timezone suffix (e.g. "2026-09-29T12:24:00").
 * If the string lacks a timezone indicator (Z or +/-offset), we treat it as UTC
 * so that JavaScript in the browser correctly converts it to the user's local timezone.
 */
export const parseApiDate = (dateStr?: string | Date | null): Date | null => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;

  const s = String(dateStr).trim();
  if (!s) return null;

  // Check if string already has timezone indicator (Z or +HH:mm or -HH:mm)
  if (/Z|[+-]\d{2}(?::?\d{2})?$/i.test(s)) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  // If ISO format without timezone (e.g. 2026-09-29T12:24:00 or 2026-09-29T12:24:00.000)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) {
    const d = new Date(s + "Z");
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * Format a date as DD/MM/YYYY
 */
export const formatDate = (
  dateInput?: string | Date | null
): string => {
  const d = parseApiDate(dateInput);
  if (!d) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Format a date as DD/MM/YYYY • HH:mm
 */
export const formatDateTime = (
  dateInput?: string | Date | null
): string => {
  const d = parseApiDate(dateInput);
  if (!d) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${day}/${month}/${year} • ${hours}:${minutes}`;
};

/**
 * Convert an API date into a string suitable for HTML5 `<input type="datetime-local">` (YYYY-MM-DDTHH:mm)
 * in the user's LOCAL browser timezone.
 */
export const toDateInputString = (
  dateInput?: string | Date | null
): string => {
  const d = parseApiDate(dateInput);
  if (!d) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
