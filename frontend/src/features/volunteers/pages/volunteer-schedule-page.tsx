import Link from 'next/link';
import { CalendarClock } from 'lucide-react';
import { SectionTitle } from '@/shared/components/ui/card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { Table, TBody, TD, TH, THead, TR } from '@/shared/components/ui/table';
import { formatDateId } from '@/shared/lib/format';
import {
  VOLUNTEER_PAST_ASSIGNMENTS,
  VOLUNTEER_UPCOMING_ASSIGNMENTS,
} from '../fixtures/volunteer-dummy';
import { DummyNotice } from '@/shared/components/ui/dummy-notice';
import { UpcomingAssignmentCard } from '../components/upcoming-assignment-card';

export function VolunteerSchedulePage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Jadwal dan Tugas"
        description="Penugasan relawan dan riwayat kegiatan yang sudah berlalu."
      />
      <DummyNotice />

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-ink">
          <CalendarClock className="h-5 w-5" aria-hidden />
          Akan Berlangsung
        </h2>
        {VOLUNTEER_UPCOMING_ASSIGNMENTS.length === 0 ? (
          <EmptyState title="Tidak ada jadwal mendatang" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {VOLUNTEER_UPCOMING_ASSIGNMENTS.map((assignment) => (
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
        {VOLUNTEER_PAST_ASSIGNMENTS.length === 0 ? (
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
              {VOLUNTEER_PAST_ASSIGNMENTS.map((assignment) => (
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
