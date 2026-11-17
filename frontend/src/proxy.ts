import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ROLE_COOKIE,
  SESSION_COOKIE,
} from '@/features/auth/lib/session-constants';
import {
  resolveRouteAccess,
  type Role,
} from '@/features/auth/lib/route-guard';

const LEGACY_ADMIN_REDIRECTS: Record<string, string> = {
  '/dashboard/admin': '/admin',
  '/dashboard/admin/borrowings': '/admin/peminjaman',
  '/dashboard/admin/reports/attendance': '/admin/laporan/presensi',
  '/dashboard/admin/reports/cash': '/admin/laporan/kas',
};

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const legacyTarget = LEGACY_ADMIN_REDIRECTS[pathname];
  if (legacyTarget) {
    const url = request.nextUrl.clone();
    url.pathname = legacyTarget;
    url.search = '';
    return NextResponse.redirect(url, 308);
  }

  if (pathname.startsWith('/dashboard/admin/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    url.search = '';
    return NextResponse.redirect(url, 308);
  }

  const isAuthenticated = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const role = request.cookies.get(ROLE_COOKIE)?.value as Role | undefined;

  const decision = resolveRouteAccess({ pathname, isAuthenticated, role });

  if (decision.type === 'redirect') {
    const url = request.nextUrl.clone();
    url.pathname = decision.to;
    url.search = decision.preserveNext
      ? `?next=${encodeURIComponent(pathname + search)}`
      : '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
