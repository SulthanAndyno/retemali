export type XlsxCellValue = string | number | boolean | null | undefined;

export interface XlsxColumn {
  /** Column width in Excel character units. */
  width?: number;
}

export interface XlsxSheet {
  name: string;
  columns?: XlsxColumn[];
  rows: XlsxCellValue[][];
  /** Style the first row as a header. Defaults to true. */
  headerRow?: boolean;
  /** Add an auto-filter across the header row. */
  autoFilter?: boolean;
  /** Freeze the header row. */
  freezeHeader?: boolean;
}

export interface ZipEntry {
  name: string;
  data: Buffer;
}
