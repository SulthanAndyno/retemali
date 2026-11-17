/** Stamp `YYYYMMDD` untuk nama file export. */
export function exportStamp(now = new Date()): string {
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}`;
}
