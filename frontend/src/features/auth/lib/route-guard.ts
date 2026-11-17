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
  { prefix: '/dashboard/admin', roles: ['ADMIN'] },
  { prefix: '/dashboard/volunteer', roles: ['VOLUNTEER'] },
  { prefix: '/dashboard/member', roles: ['MEMBER', 'DONOR'] },
  { prefix: '/portal', roles: ['MEMBER', 'VOLUNTEER', 'DONOR', 'ADMIN'] },
];

const AUTH_PAGES = ['/login', '/register'];

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
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
    return { type: 'redirect', to: '/portal' };
  }

  return { type: 'next' };
}
