'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { DummyNotice } from '@/features/admin/components/dummy-notice';
import {
  DUMMY_MEMBERS,
  type DummyMembershipStatus,
} from '@/features/admin/fixtures/admin-dummy';

interface AdminMembersPageProps {
  initialSearch?: string;
  initialStatus?: 'all' | DummyMembershipStatus;
}

export function AdminMembersPage({
  initialSearch = '',
  initialStatus = 'all',
}: AdminMembersPageProps) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<'all' | DummyMembershipStatus>(initialStatus);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (status !== 'all') params.set('status', status);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [search, status, pathname, router]);

  const rows = useMemo(
    () =>
      DUMMY_MEMBERS.filter((member) => {
        const matchesSearch =
          !search ||
          member.fullName.toLowerCase().includes(search.toLowerCase()) ||
          member.email.toLowerCase().includes(search.toLowerCase()) ||
          member.memberNo.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === 'all' || member.membershipStatus === status;
        return matchesSearch && matchesStatus;
      }),
    [search, status]
  );

  const notAvailable = () =>
    toast('Endpoint manajemen member sedang dikerjakan backend.', 'warning');

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Manajemen Member"
        description="Data contoh sampai endpoint users tersedia."
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
            <option value="expired">Kedaluwarsa</option>
          </select>
        </label>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>Kode</TH>
            <TH>Nama</TH>
            <TH>Email</TH>
            <TH>Telepon</TH>
            <TH>Status</TH>
            <TH>Aksi</TH>
          </TR>
        </THead>
        <TBody>
          {rows.map((member) => (
            <TR key={member.id}>
              <TD className="font-mono text-xs">{member.memberNo}</TD>
              <TD className="font-medium">{member.fullName}</TD>
              <TD>{member.email}</TD>
              <TD>{member.phone}</TD>
              <TD>
                <Badge
                  tone={
                    member.membershipStatus === 'active'
                      ? 'success'
                      : member.membershipStatus === 'pending'
                        ? 'warning'
                        : 'danger'
                  }
                >
                  {member.membershipStatus}
                </Badge>
              </TD>
              <TD>
                <Button size="sm" variant="secondary" onClick={notAvailable}>
                  Kelola
                </Button>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
      <DummyNotice />
    </div>
  );
}
