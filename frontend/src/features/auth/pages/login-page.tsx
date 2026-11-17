'use client';

import { Logo } from '@/shared/components/ui/logo';
import { Card } from '@/shared/components/ui/card';
import { useLoginForm } from '../hooks/use-login-form';
import { ACCESS_MODES, LOGIN_FEATURES } from '../lib/auth-options';
import { AuthAccessOption } from '../components/auth-access-option';
import { AuthLoginForm } from '../components/auth-login-form';
import { AuthNonMemberPanel } from '../components/auth-nonmember-panel';

export function LoginPage() {
  const form = useLoginForm();
  const isNonMember = form.selectedRole === 'NON_MEMBER';

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
      <section className="flex flex-col justify-center gap-6 bg-surface-blue/60 px-6 py-10 lg:px-14">
        <div className="flex items-center gap-4">
          <Logo size={56} showName={false} />
          <div>
            <h1 className="text-2xl font-extrabold text-primary-deep lg:text-3xl">
              Selamat Datang di ReteMali
            </h1>
            <p className="mt-1 max-w-md text-sm text-ink-soft lg:text-base">
              Temukan buku, ikuti kegiatan komunitas, dan tumbuh bersama Taman
              Baca ReteMali.
            </p>
          </div>
        </div>
        <p className="max-w-md text-sm text-ink lg:text-base">
          ReteMali hadir sebagai ruang belajar, membaca, dan bertumbuh bersama
          masyarakat melalui kegiatan literasi yang terbuka dan bermanfaat.
        </p>
        <ul className="grid gap-2 text-sm text-ink lg:grid-cols-2">
          {LOGIN_FEATURES.map((feature) => (
            <li
              key={feature}
              className="rounded-card bg-white/80 px-4 py-3 shadow-card"
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col justify-center px-6 py-10 lg:px-14">
        <div className="mx-auto w-full max-w-md space-y-5">
          <div>
            <h2 className="text-lg font-bold text-primary-deep">
              Pilih mode akses
            </h2>
            <p className="text-sm text-ink-soft">
              Member, volunteer, admin, dan pengunjung publik memiliki hak akses
              yang berbeda. Pilih sesuai peran yang telah diverifikasi.
            </p>
          </div>

          <div className="space-y-3">
            {ACCESS_MODES.map((option) => (
              <AuthAccessOption
                key={option.key}
                option={option}
                selected={form.selectedRole === option.key}
                onSelect={() => form.selectRole(option.key)}
              />
            ))}
          </div>

          <Card>
            {isNonMember ? (
              <AuthNonMemberPanel onOpen={form.openPublicApp} />
            ) : (
              <AuthLoginForm
                mode={form.selectedRole as Exclude<typeof form.selectedRole, 'NON_MEMBER'>}
                roleLabel={form.roleLabel}
                email={form.email}
                password={form.password}
                showPassword={form.showPassword}
                loading={form.loading}
                error={form.error}
                errors={form.errors}
                onEmailChange={form.setEmail}
                onPasswordChange={form.setPassword}
                onTogglePassword={form.togglePassword}
                onSubmit={form.submit}
              />
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
