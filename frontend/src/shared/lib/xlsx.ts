import type { XlsxSheet, ZipEntry } from './xlsx-types';
import { zip } from './xlsx-zip';
import {
  ROOT_RELS,
  STYLES_XML,
  escapeXml,
  sanitizeSheetName,
  sheetXml,
} from './xlsx-sheet';

export type { XlsxCellValue, XlsxColumn, XlsxSheet } from './xlsx-types';

/**
 * Minimal, dependency-free SpreadsheetML (.xlsx) writer.
 *
 * The project does not ship an Excel library, so reports are exported by
 * assembling the OOXML package (workbook + worksheets + styles) and zipping it
 * with Node's built-in zlib.
 *
 * Server-only: uses node:zlib. Import from route handlers, never a client component.
 */

export const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/** Builds a complete .xlsx workbook from one or more sheets. */
export function buildXlsx(sheets: XlsxSheet[]): Buffer {
  const source = sheets.length > 0 ? sheets : [{ name: 'Sheet1', rows: [] }];
  const usedNames = new Set<string>();
  const safeSheets = source.map((sheet) => ({
    name: sanitizeSheetName(sheet.name, usedNames),
    xml: sheetXml(sheet),
  }));

  const workbookSheets = safeSheets
    .map(
      (sheet, index) =>
        `<sheet name="${escapeXml(sheet.name)}" sheetId="${
          index + 1
        }" r:id="rId${index + 1}"/>`
    )
    .join('');

  const workbookXml =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    `<sheets>${workbookSheets}</sheets>` +
    '</workbook>';

  const workbookRels =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    safeSheets
      .map(
        (_sheet, index) =>
          `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${
            index + 1
          }.xml"/>`
      )
      .join('') +
    `<Relationship Id="rId${
      safeSheets.length + 1
    }" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
    '</Relationships>';

  const contentTypes =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
    safeSheets
      .map(
        (_sheet, index) =>
          `<Override PartName="/xl/worksheets/sheet${
            index + 1
          }.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
      )
      .join('') +
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
    '</Types>';

  const entries: ZipEntry[] = [
    { name: '[Content_Types].xml', data: Buffer.from(contentTypes, 'utf8') },
    { name: '_rels/.rels', data: Buffer.from(ROOT_RELS, 'utf8') },
    { name: 'xl/workbook.xml', data: Buffer.from(workbookXml, 'utf8') },
    {
      name: 'xl/_rels/workbook.xml.rels',
      data: Buffer.from(workbookRels, 'utf8'),
    },
    { name: 'xl/styles.xml', data: Buffer.from(STYLES_XML, 'utf8') },
    ...safeSheets.map((sheet, index) => ({
      name: `xl/worksheets/sheet${index + 1}.xml`,
      data: Buffer.from(sheet.xml, 'utf8'),
    })),
  ];

  return zip(entries);
}

/** Convenience helper: build a workbook and wrap it in a download Response. */
export function xlsxResponse(buffer: Buffer, filename: string): Response {
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': XLSX_CONTENT_TYPE,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'no-store',
    },
  });
}
