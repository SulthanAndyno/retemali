export type CatalogRole = 'MEMBER' | 'VOLUNTEER' | 'DONOR' | 'ADMIN' | null | undefined;

export function canCreateBook(role: CatalogRole): boolean {
  return role === 'ADMIN';
}

export function canManageBook(role: CatalogRole): boolean {
  return role === 'ADMIN' || role === 'VOLUNTEER';
}

export function canDeleteBook(role: CatalogRole): boolean {
  return role === 'ADMIN';
}
