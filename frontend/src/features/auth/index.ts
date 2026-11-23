'use client';

/**
 * Public API fitur auth. Konsumen (app/ atau fitur lain) hanya boleh
 * mengimpor dari sini, bukan dari internal `contexts/*` atau `features/auth/lib/*`.
 *
 * Provider berada di `features/auth/providers`; barrel ini menjadi public API.
 */
export { AuthProvider, useAuth } from './providers/auth-provider';
export { LoginPage } from './pages/login-page';
export { RegisterPage } from './pages/register-page';
export { ForgotPasswordPage } from './pages/forgot-password-page';

export type { Role, SafeUser, User } from './types';
