import type { XlsxCellValue, XlsxSheet } from './xlsx-types';

const INVALID_XML_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

export function escapeXml(value: string): string {
  return value
    .replace(INVALID_XML_CHARS, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function columnName(index: number): string {
  let n = index + 1;
  let name = '';
  while (n > 0) {
    const remainder = (n - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

export function sanitizeSheetName(
  name: string,
  used: Set<string>
): string {
  const base =
    (name || 'Sheet').replace(/[\\/?*[\]:]/g, ' ').trim().slice(0, 31) ||
    'Sheet';
  let candidate = base;
  let counter = 2;
  while (used.has(candidate.toLowerCase())) {
    const suffix = ` (${counter})`;
    candidate = `${base.slice(0, 31 - suffix.length)}${suffix}`;
    counter += 1;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

function cellXml(
  ref: string,
  value: XlsxCellValue,
  styleIndex: number
): string {
  if (value === null || value === undefined) return '';
  const style = styleIndex ? ` s="${styleIndex}"` : '';

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '';
    return `<c r="${ref}"${style}><v>${value}</v></c>`;
  }

  if (typeof value === 'boolean') {
    return `<c r="${ref}" t="b"${style}><v>${value ? 1 : 0}</v></c>`;
  }

  const text = String(value);
  if (text.length === 0) return '';
  return `<c r="${ref}" t="inlineStr"${style}><is><t xml:space="preserve">${escapeXml(
    text.slice(0, 32000)
  )}</t></is></c>`;
}

export function sheetXml(sheet: XlsxSheet): string {
  const rows = sheet.rows ?? [];
  const maxColumns = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const styleHeader = sheet.headerRow !== false;

  const dimension =
    maxColumns > 0 && rows.length > 0
      ? `<dimension ref="A1:${columnName(maxColumns - 1)}${rows.length}"/>`
      : '';

  const sheetViews = sheet.freezeHeader
    ? '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
    : '';

  const cols =
    sheet.columns && sheet.columns.length > 0
      ? `<cols>${sheet.columns
          .map(
            (column, index) =>
              `<col min="${index + 1}" max="${index + 1}" width="${
                column.width ?? 18
              }" customWidth="1"/>`
          )
          .join('')}</cols>`
      : '';

  const sheetData = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((value, columnIndex) =>
          cellXml(
            `${columnName(columnIndex)}${rowIndex + 1}`,
            value,
            styleHeader && rowIndex === 0 ? 1 : 0
          )
        )
        .join('');
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join('');

  const autoFilter =
    sheet.autoFilter && rows.length > 1 && maxColumns > 0
      ? `<autoFilter ref="A1:${columnName(maxColumns - 1)}${rows.length}"/>`
      : '';

  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    `${dimension}${sheetViews}${cols}<sheetData>${sheetData}</sheetData>${autoFilter}` +
    '</worksheet>'
  );
}

export const STYLES_XML =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
  '<fonts count="2">' +
  '<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font>' +
  '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>' +
  '</fonts>' +
  '<fills count="3">' +
  '<fill><patternFill patternType="none"/></fill>' +
  '<fill><patternFill patternType="gray125"/></fill>' +
  '<fill><patternFill patternType="solid"><fgColor rgb="FF1D4ED8"/><bgColor indexed="64"/></patternFill></fill>' +
  '</fills>' +
  '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
  '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
  '<cellXfs count="2">' +
  '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
  '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
  '</cellXfs>' +
  '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
  '</styleSheet>';

export const ROOT_RELS =
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
  '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
  '</Relationships>';
