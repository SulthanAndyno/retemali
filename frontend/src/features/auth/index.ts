'use client';

/**
 * Public API fitur auth. Konsumen (app/ atau fitur lain) hanya boleh
 * mengimpor dari sini, bukan dari internal `contexts/*` atau `features/auth/lib/*`.
 *
 * Provider masih tinggal di `contexts/` (fase migrasi berikutnya); barrel ini
 * menjadi seam agar pemindahan file tidak mengubah konsumen.
 */
export { AuthProvider, useAuth } from '@/contexts/AuthContext';
export { RoleProvider, useRole } from '@/contexts/RoleContext';
export { LoginPage } from './pages/login-page';
export { RegisterPage } from './pages/register-page';
export { ForgotPasswordPage } from './pages/forgot-password-page';

export type {
  ActiveRole,
  RoleMode,
  RoleSwitchResult,
  SwitchableRole,
} from '@/contexts/RoleContext';
export type { Role, SafeUser, User } from './types';
