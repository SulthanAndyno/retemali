const BASE_URL = '/api/backend';

/**
 * Error dari BFF/backend. `status` memungkinkan pemanggil membedakan
 * 401 (sesi habis), 403 (role), 400/404 (validasi), dan 5xx.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

export async function apiRequest<T = unknown>(
  method: string,
  path: string,
  body?: unknown,
  extraHeaders?: Record<string, string>
): Promise<T> {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const formData = isFormData(body);

  const headers: Record<string, string> = { ...extraHeaders };
  // Multipart: biarkan browser menulis boundary sendiri.
  if (!formData) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'same-origin',
    cache: 'no-store',
  };

  if (body !== undefined && method !== 'GET') {
    config.body = formData ? body : JSON.stringify(body);
  }

  const response = await fetch(url, config);

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
  }

  if (!response.ok) {
    const errorData = data as { message?: string };
    throw new ApiError(
      errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      data
    );
  }

  return data as T;
}

export function get<T = unknown>(path: string, headers?: Record<string, string>): Promise<T> {
  return apiRequest<T>('GET', path, undefined, headers);
}

export function post<T = unknown>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  return apiRequest<T>('POST', path, body, headers);
}

export function patch<T = unknown>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  return apiRequest<T>('PATCH', path, body, headers);
}

export function del<T = unknown>(path: string, headers?: Record<string, string>): Promise<T> {
  return apiRequest<T>('DELETE', path, undefined, headers);
}
