'use client';

import { useState } from 'react';
import { downloadFile, type QueryParams } from '@/shared/lib/same-origin';

export interface ExportResult {
  ok: boolean;
  message: string;
}

export interface UseReportExportResult {
  exporting: boolean;
  download: (
    path: string,
    params: QueryParams,
    fallbackFilename: string
  ) => Promise<ExportResult>;
}

export function useReportExport(): UseReportExportResult {
  const [exporting, setExporting] = useState(false);

  const download = async (
    path: string,
    params: QueryParams,
    fallbackFilename: string
  ): Promise<ExportResult> => {
    setExporting(true);
    try {
      const { blob, filename } = await downloadFile(path, params, fallbackFilename);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      return { ok: true, message: `Berkas ${filename} berhasil diunduh.` };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error ? error.message : 'Gagal membuat berkas Excel.',
      };
    } finally {
      setExporting(false);
    }
  };

  return { exporting, download };
}
