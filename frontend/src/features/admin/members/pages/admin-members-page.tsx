'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Copy, KeyRound, RefreshCw } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Input } from '@/shared/components/ui/input';
import { Modal } from '@/shared/components/ui/modal';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { useToast } from '@/shared/components/ui/toast';
import { ApiError, get, patch } from '@/shared/lib/api';
import type { ApiEnvelope, PaginatedMeta } from '@/shared/types/api';

type DummyMembershipStatus = 'active' | 'pending' | 'expired';
type MemberAccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

interface AdminUserRecord {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'MEMBER' | 'VOLUNTEER' | 'ADMIN';
  status: MemberAccountStatus;
  points: number;
  createdAt: string;
}

interface AdminMembersPageProps {
  initialSearch?: string;
  initialStatus?: 'all' | DummyMembershipStatus;
}

function toBackendStatus(
  status: 'all' | DummyMembershipStatus
): MemberAccountStatus | undefined {
  if (status === 'active') return 'ACTIVE';
  if (status === 'pending') return 'PENDING';
  if (status === 'expired') return 'SUSPENDED';
  return undefined;
}

function formatStatusLabel(status: MemberAccountStatus): string {
  if (status === 'ACTIVE') return 'Aktif';
  if (status === 'PENDING') return 'Menunggu';
  return 'Ditangguhkan';
}

function generateTempPassword(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `ReteMali${digits}`;
}

export function AdminMembersPage({
  initialSearch = '',
  initialStatus = 'all',
}: AdminMembersPageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<'all' | DummyMembershipStatus>(
    initialStatus
  );
  const [rows, setRows] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [editingMember, setEditingMember] = useState<AdminUserRecord | null>(
    null
  );
  const [nextEmail, setNextEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [savingCredentials, setSavingCredentials] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (status !== 'all') params.set('status', status);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [search, status, pathname, router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({ limit: '50' });
      if (search.trim()) query.set('search', search.trim());
      const backendStatus = toBackendStatus(status);
      if (backendStatus) query.set('status', backendStatus);

      const res = await get<
        ApiEnvelope<AdminUserRecord[]> & { meta: PaginatedMeta }
      >(`/auth/users?${query.toString()}`);
      setRows(res.data ?? []);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Gagal memuat daftar anggota.'
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const handleToggleStatus = async (member: AdminUserRecord) => {
    const nextStatus: MemberAccountStatus =
      member.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUpdatingId(member.id);
    try {
      await patch<ApiEnvelope<AdminUserRecord>>(
        `/auth/users/${member.id}/status`,
        { status: nextStatus }
      );
      await load();
      toast(
        `Status anggota ${member.name} diperbarui menjadi ${formatStatusLabel(nextStatus)}.`,
        'success'
      );
    } catch (err) {
      toast(
        err instanceof ApiError
          ? err.message
          : 'Gagal memperbarui status anggota.',
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const openResetModal = (member: AdminUserRecord) => {
    setEditingMember(member);
    setNextEmail(member.email);
    setNewPassword('');
    setModalError(null);
  };

  const closeResetModal = () => {
    setEditingMember(null);
    setNextEmail('');
    setNewPassword('');
    setModalError(null);
  };

  const handleCopyCredentials = async () => {
    if (!editingMember) return;
    const lines = [`Email: ${nextEmail.trim() || editingMember.email}`];
    if (newPassword.trim()) {
      lines.push(`Password Sementara: ${newPassword.trim()}`);
    }
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      toast('Kredensial disalin ke clipboard.', 'success');
    } catch {
      toast('Tidak dapat menyalin ke clipboard.', 'error');
    }
  };

  const handleResetCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMember) return;

    const trimmedEmail = nextEmail.trim().toLowerCase();
    const trimmedPassword = newPassword.trim();
    const emailChanged =
      trimmedEmail.length > 0 && trimmedEmail !== editingMember.email.toLowerCase();

    if (!emailChanged && !trimmedPassword) {
      setModalError('Ubah email atau masukkan password baru terlebih dahulu.');
      return;
    }

    setSavingCredentials(true);
    setModalError(null);

    try {
      const payload: { email?: string; newPassword?: string } = {};
      if (emailChanged) payload.email = trimmedEmail;
      if (trimmedPassword) payload.newPassword = trimmedPassword;

      await patch<ApiEnvelope<AdminUserRecord>>(
        `/auth/users/${editingMember.id}/credentials`,
        payload
      );
      await load();
      toast(
        trimmedPassword
          ? `Kredensial ${editingMember.name} diperbarui. Bagikan password sementara secara aman.`
          : `Email ${editingMember.name} berhasil diperbarui.`,
        'success'
      );
      closeResetModal();
    } catch (err) {
      setModalError(
        err instanceof ApiError
          ? err.message
          : 'Gagal memperbarui kredensial akun.'
      );
    } finally {
      setSavingCredentials(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Manajemen Member"
        description="Daftar seluruh anggota terdaftar, status keanggotaan, dan reset email/kata sandi."
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="member-search"
          label="Cari member"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nama, email, atau kode member"
        />
        <label className="text-sm font-semibold text-ink">
          Status
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as 'all' | DummyMembershipStatus)
            }
            className="mt-1.5 w-full rounded-field border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
          >
            <option value="all">Semua</option>
            <option value="active">Aktif</option>
            <option value="pending">Menunggu</option>
            <option value="expired">Ditangguhkan</option>
          </select>
        </label>
      </div>

      {error ? (
        <div className="flex items-center justify-between rounded-card border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-danger">{error}</p>
          <Button size="sm" variant="danger" onClick={() => void load()}>
            Coba Lagi
          </Button>
        </div>
      ) : loading ? (
        <div className="h-40 animate-pulse rounded-card bg-white" />
      ) : rows.length === 0 ? (
        <EmptyState title="Tidak ada anggota yang cocok dengan pencarian" />
      ) : (
        <Table>
          <THead>
            <TR>
              <TH>Kode</TH>
              <TH>Nama</TH>
              <TH>Email</TH>
              <TH>Telepon</TH>
              <TH>Peran</TH>
              <TH>Status</TH>
              <TH>Aksi</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((member) => (
              <TR key={member.id}>
                <TD className="font-mono text-xs">{member.memberCode}</TD>
                <TD className="font-medium">{member.name}</TD>
                <TD>{member.email}</TD>
                <TD>{member.phone ?? '-'}</TD>
                <TD>
                  <Badge tone="info">{member.role}</Badge>
                </TD>
                <TD>
                  <Badge
                    tone={
                      member.status === 'ACTIVE'
                        ? 'success'
                        : member.status === 'PENDING'
                          ? 'warning'
                          : 'danger'
                    }
                  >
                    {formatStatusLabel(member.status)}
                  </Badge>
                </TD>
                <TD>
                  {member.role !== 'ADMIN' ? (
                    <div className="flex flex-wrap gap-1.5">
                      <Button
                        size="sm"
                        variant={
                          member.status === 'ACTIVE' ? 'danger' : 'success'
                        }
                        disabled={updatingId === member.id}
                        onClick={() => void handleToggleStatus(member)}
                      >
                        {member.status === 'ACTIVE' ? 'Tangguhkan' : 'Aktifkan'}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openResetModal(member)}
                      >
                        <KeyRound className="h-3.5 w-3.5" aria-hidden />
                        Reset Akun
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-ink-soft">Admin Utama</span>
                  )}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}

      <Modal
        open={Boolean(editingMember)}
        onClose={closeResetModal}
        title="Reset Email & Kata Sandi Anggota"
        description={
          editingMember
            ? `${editingMember.name} (${editingMember.memberCode})`
            : undefined
        }
      >
        <form onSubmit={handleResetCredentials} className="space-y-4">
          <Input
            id="reset-member-email"
            label="Email Akun"
            type="email"
            required
            value={nextEmail}
            onChange={(event) => setNextEmail(event.target.value)}
            placeholder="email@domain.id"
          />

          <div className="space-y-2">
            <Input
              id="reset-member-password"
              label="Kata Sandi Baru (Opsional)"
              type="text"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Kosongkan jika hanya mengganti email"
              hint="Minimal 8 karakter, mengandung minimal 1 huruf kapital dan 1 angka."
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setNewPassword(generateTempPassword())}
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                Buat Sandi Acak
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => void handleCopyCredentials()}
              >
                <Copy className="h-3.5 w-3.5" aria-hidden />
                Salin Kredensial
              </Button>
            </div>
          </div>

          {modalError ? (
            <p
              role="alert"
              className="rounded-field border border-red-200 bg-red-50 px-3 py-2 text-xs text-danger"
            >
              {modalError}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={closeResetModal}>
              Batal
            </Button>
            <Button type="submit" loading={savingCredentials}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
