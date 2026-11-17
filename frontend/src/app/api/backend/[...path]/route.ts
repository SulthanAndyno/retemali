import type { NextRequest } from 'next/server';
import { upstreamUrl } from '@/lib/serverUpstream';
import { getSessionToken } from '@/features/auth/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;

  if (path.some((segment) => segment === '..')) {
    return Response.json(
      { status: 'error', message: 'Path tidak valid' },
      { status: 400 },
    );
  }

  const token = await getSessionToken();

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  if (token) headers.set('authorization', `Bearer ${token}`);

  const hasBody = !['GET', 'HEAD'].includes(request.method);

  try {
    const upstream = await fetch(
      `${upstreamUrl(`/${path.join('/')}`)}${request.nextUrl.search}`,
      {
        method: request.method,
        headers,
        body: hasBody ? await request.arrayBuffer() : undefined,
        cache: 'no-store',
      },
    );

    const responseHeaders = new Headers();
    const upstreamType = upstream.headers.get('content-type');
    if (upstreamType) responseHeaders.set('content-type', upstreamType);
    const disposition = upstream.headers.get('content-disposition');
    if (disposition) responseHeaders.set('content-disposition', disposition);

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { status: 'error', message: 'Tidak dapat menghubungi server Rete Mali.' },
      { status: 502 },
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as PUT,
  handler as DELETE,
};
