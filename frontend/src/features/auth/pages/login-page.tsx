'use client';

import Header from '@/components/layout/Header';
import { useLoginForm } from '../hooks/use-login-form';
import { AuthHero } from '../components/auth-hero';
import { LoginFeaturePills } from '../components/login-feature-pills';
import { LoginRoleSelector } from '../components/login-role-selector';
import { LoginForm } from '../components/login-form';
import { LoginPublicBenefits } from '../components/login-public-benefits';
import { LoginPublicCta } from '../components/login-public-cta';

export function LoginPage() {
  const form = useLoginForm();

  return (
    <div className="min-h-screen bg-blue-50 pb-10">
      <Header title="Masuk Akun" showBack />
      <div className="max-w-md mx-auto px-4 pt-6">
        <AuthHero />
        <LoginFeaturePills />
        <LoginRoleSelector
          selectedRole={form.selectedRole}
          onSelect={form.selectRole}
        />

        {form.selectedRole && form.selectedRole !== 'NON_MEMBER' && (
          <LoginForm
            roleLabel={form.roleLabel}
            email={form.email}
            password={form.password}
            showPassword={form.showPassword}
            loading={form.loading}
            error={form.error}
            onEmailChange={form.setEmail}
            onPasswordChange={form.setPassword}
            onTogglePassword={form.togglePassword}
            onClose={form.closeForm}
            onSubmit={form.submit}
          />
        )}

        <LoginPublicBenefits />
        <LoginPublicCta onOpen={form.openPublicApp} />
      </div>
    </div>
  );
}
