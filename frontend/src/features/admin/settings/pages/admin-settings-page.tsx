'use client';

import { useState } from 'react';
import { AlertCircle, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, SectionTitle } from '@/shared/components/ui/card';
import { Input, Textarea } from '@/shared/components/ui/input';
import { useToast } from '@/shared/components/ui/toast';
import { formatDateTimeId } from '@/shared/lib/format';
import { PaymentAccountsCard } from '@/features/dashboard/admin/components/payment-accounts-card';
import { usePaymentAccounts } from '@/features/dashboard/admin/hooks/use-payment-accounts';
import type { PaymentAccount } from '@/features/dashboard/admin/types/admin.types';
import { useSiteSettings } from '../hooks/use-site-settings';

export function AdminSettingsPage() {
  const { toast } = useToast();
  const {
    form,
    loading,
    saving,
    error,
    fieldErrors,
    dirty,
    updatedAt,
    updateField,
    reload,
    reset,
    save,
  } = useSiteSettings();
  const payment = usePaymentAccounts();
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    setSubmitting(true);
    const result = await save();
    setSubmitting(false);
    toast(result.message, result.ok ? 'success' : 'error');
  };

  const handlePaymentToggle = async (account: PaymentAccount) => {
    const result = await payment.toggle(account);
    toast(result.message, result.ok ? 'success' : 'error');
  };

  const handlePaymentDelete = async (account: PaymentAccount) => {
    const result = await payment.remove(account);
    toast(result.message, result.ok ? 'success' : 'error');
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Pengaturan Website"
        description="Profil komunitas yang tampil di landing page, portal, dan halaman donasi."
      />

      {error ? (
        <div className="flex items-center justify-between gap-3 rounded-card border border-red-200 bg-red-50 p-3">
          <p className="flex items-center gap-2 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            {error}
          </p>
          <Button size="sm" variant="danger" onClick={() => void reload()}>
            <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            Coba Lagi
          </Button>
        </div>
      ) : null}

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-primary-deep">Profil Komunitas</h3>
          <p className="text-xs text-ink-soft">
            {updatedAt
              ? `Terakhir diperbarui ${formatDateTimeId(updatedAt)}`
              : 'Belum pernah diperbarui'}
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="h-11 animate-pulse rounded-field bg-slate-100" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="site-name"
                label="Nama Situs"
                value={form.siteName}
                error={fieldErrors.siteName}
                onChange={(event) => updateField('siteName', event.target.value)}
              />
              <Input
                id="site-tagline"
                label="Tagline"
                value={form.tagline}
                error={fieldErrors.tagline}
                onChange={(event) => updateField('tagline', event.target.value)}
              />
            </div>

            <Input
              id="site-address"
              label="Alamat"
              value={form.address}
              error={fieldErrors.address}
              onChange={(event) => updateField('address', event.target.value)}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="site-phone"
                label="Telepon"
                value={form.phone}
                error={fieldErrors.phone}
                onChange={(event) => updateField('phone', event.target.value)}
              />
              <Input
                id="site-email"
                label="Email"
                type="email"
                value={form.email}
                error={fieldErrors.email}
                onChange={(event) => updateField('email', event.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="site-open-days"
                label="Hari Buka"
                value={form.openDays}
                error={fieldErrors.openDays}
                onChange={(event) => updateField('openDays', event.target.value)}
              />
              <Input
                id="site-open-hours"
                label="Jam Buka"
                value={form.openHours}
                error={fieldErrors.openHours}
                onChange={(event) => updateField('openHours', event.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="site-maps"
                label="Google Maps URL"
                placeholder="https://maps.google.com/..."
                value={form.mapsUrl}
                error={fieldErrors.mapsUrl}
                onChange={(event) => updateField('mapsUrl', event.target.value)}
              />
              <Input
                id="site-instagram"
                label="Instagram URL"
                placeholder="https://instagram.com/..."
                value={form.instagramUrl}
                error={fieldErrors.instagramUrl}
                onChange={(event) => updateField('instagramUrl', event.target.value)}
              />
            </div>

            <Textarea
              id="site-instructions"
              label="Instruksi Donasi"
              value={form.donationInstructions}
              error={fieldErrors.donationInstructions}
              onChange={(event) =>
                updateField('donationInstructions', event.target.value)
              }
            />

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => void handleSave()} disabled={saving || submitting}>
                <Save className="h-4 w-4" aria-hidden />
                {saving || submitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </Button>
              <Button
                variant="secondary"
                onClick={reset}
                disabled={!dirty || saving || submitting}
              >
                Batalkan Perubahan
              </Button>
              {dirty ? (
                <span className="text-xs font-semibold text-amber-600">
                  Ada perubahan belum disimpan
                </span>
              ) : null}
            </div>
          </>
        )}
      </Card>

      <PaymentAccountsCard
        accounts={payment.accounts}
        loading={payment.loading}
        error={payment.error}
        busyId={payment.busyId}
        formOpen={payment.formOpen}
        editingId={payment.editingId}
        form={payment.form}
        qrisPreview={payment.qrisPreview}
        saving={payment.saving}
        onReload={() => void payment.reload()}
        onCreate={payment.openCreate}
        onEdit={payment.openEdit}
        onToggle={(account) => void handlePaymentToggle(account)}
        onDelete={(account) => void handlePaymentDelete(account)}
        onCloseForm={payment.closeForm}
        onFieldChange={payment.updateField}
        onQrisFileChange={payment.selectQrisFile}
        onSubmit={async () => {
          const result = await payment.submit();
          toast(result.message, result.ok ? 'success' : 'error');
        }}
      />
    </div>
  );
}
