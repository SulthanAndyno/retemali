'use client';

import Link from 'next/link';
import { CalendarClock } from 'lucide-react';
import { SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { formatDateId } from '@/shared/lib/format';
import { UpcomingAssignmentCard } from '../components/upcoming-assignment-card';
import { useVolunteerPortalData } from '../hooks/use-volunteer-portal-data';

export function VolunteerSchedulePage() {
  const { upcomingAssignments, pastAssignments, loading } =
    useVolunteerPortalData();

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Jadwal dan Tugas"
        description="Penugasan relawan dan riwayat kegiatan yang sudah berlalu."
      />

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-ink">
          <CalendarClock className="h-5 w-5" aria-hidden />
          Akan Berlangsung
        </h2>
        {loading ? (
          <div className="h-32 animate-pulse rounded-card bg-white" />
        ) : upcomingAssignments.length === 0 ? (
          <EmptyState title="Tidak ada jadwal mendatang" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingAssignments.map((assignment) => (
              <UpcomingAssignmentCard
                key={assignment.id}
                assignment={assignment}
                showBadge
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-base font-bold text-ink">Sudah Berlalu</h2>
        {loading ? (
          <div className="h-32 animate-pulse rounded-card bg-white" />
        ) : pastAssignments.length === 0 ? (
          <EmptyState title="Belum ada penugasan selesai" />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Kegiatan</TH>
                <TH>Jadwal</TH>
                <TH>Lokasi</TH>
                <TH>Tanggung Jawab</TH>
              </TR>
            </THead>
            <TBody>
              {pastAssignments.map((assignment) => (
                <TR key={assignment.id}>
                  <TD>
                    <Link
                      href="/kegiatan"
                      className="font-semibold text-primary-deep underline-offset-4 hover:underline"
                    >
                      {assignment.title}
                    </Link>
                  </TD>
                  <TD>
                    {formatDateId(assignment.eventDate)} • {assignment.startTime}–
                    {assignment.endTime} WIB
                  </TD>
                  <TD>{assignment.location}</TD>
                  <TD>{assignment.responsibilities}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </section>
    </div>
  );
}
