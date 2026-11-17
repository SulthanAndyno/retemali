import { ApiError } from './api';

export type QueryParams = Record<string, string | number | null | undefined>;

function withQuery(path: string, params?: QueryParams): string {
  if (!params) return path;

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') continue;
    query.set(key, String(value));
  }

  const suffix = query.toString();
  return suffix ? `${path}?${suffix}` : path;
}

async function readError(response: Response): Promise<ApiError> {
  const payload = (await response.json().catch(() => null)) as
    | { message?: string }
    | null;

  return new ApiError(
    payload?.message ?? `Permintaan gagal (HTTP ${response.status}).`,
    response.status,
    payload
  );
}

/** JSON request ke route handler same-origin (mis. `/api/reports/...`). */
export async function getJson<T>(path: string, params?: QueryParams): Promise<T> {
  const response = await fetch(withQuery(path, params), {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
    cache: 'no-store',
  });

  if (!response.ok) throw await readError(response);
  return (await response.json()) as T;
}

export interface DownloadedFile {
  blob: Blob;
  filename: string;
}

/** Download biner same-origin (xlsx export) + nama file dari Content-Disposition. */
export async function downloadFile(
  path: string,
  params?: QueryParams,
  fallbackFilename = 'laporan.xlsx'
): Promise<DownloadedFile> {
  const response = await fetch(withQuery(path, params), {
    credentials: 'same-origin',
    cache: 'no-store',
  });

  if (!response.ok) throw await readError(response);

  const disposition = response.headers.get('content-disposition') ?? '';
  const match = /filename="?([^"]+)"?/.exec(disposition);

  return {
    blob: await response.blob(),
    filename: match?.[1] ?? fallbackFilename,
  };
}
