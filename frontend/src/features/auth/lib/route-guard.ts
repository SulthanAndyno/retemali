export type Role = 'MEMBER' | 'VOLUNTEER' | 'DONOR' | 'ADMIN';

export interface GuardInput {
  pathname: string;
  isAuthenticated: boolean;
  role?: Role;
}

export type GuardDecision =
  | { type: 'next' }
  | { type: 'redirect'; to: string; preserveNext?: boolean };

const RULES: { prefix: string; roles: Role[] }[] = [
  { prefix: '/admin', roles: ['ADMIN'] },
  { prefix: '/dashboard/admin', roles: ['ADMIN'] },
  { prefix: '/volunteer', roles: ['VOLUNTEER'] },
  { prefix: '/dashboard/volunteer', roles: ['VOLUNTEER'] },
  { prefix: '/member', roles: ['MEMBER', 'DONOR'] },
  { prefix: '/dashboard/member', roles: ['MEMBER', 'DONOR'] },
  { prefix: '/portal', roles: ['MEMBER', 'VOLUNTEER', 'DONOR', 'ADMIN'] },
];

const AUTH_PAGES = [
  '/login',
  '/login/daftar',
  '/login/lupa-password',
  '/register',
];

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/** Dashboard utama per role, dipakai setelah login dan saat membuka halaman auth. */
export function dashboardForRole(role?: Role): string {
  if (role === 'ADMIN') return '/admin';
  if (role === 'VOLUNTEER') return '/volunteer';
  if (role === 'MEMBER' || role === 'DONOR') return '/dashboard/member';
  return '/portal';
}

export function resolveRouteAccess({
  pathname,
  isAuthenticated,
  role,
}: GuardInput): GuardDecision {
  const rule = RULES.find((item) => matchesPrefix(pathname, item.prefix));

  if (rule && !isAuthenticated) {
    return { type: 'redirect', to: '/login', preserveNext: true };
  }

  if (rule && role && !rule.roles.includes(role)) {
    return { type: 'redirect', to: '/portal' };
  }

  if (!rule && isAuthenticated && AUTH_PAGES.includes(pathname)) {
    return { type: 'redirect', to: dashboardForRole(role) };
  }

  return { type: 'next' };
}
