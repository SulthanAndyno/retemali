import 'server-only';
import type { NextRequest } from 'next/server';
import { endOfDayIso, upstreamRequest } from '@/shared/lib/server-upstream';
import { buildXlsx, type XlsxCellValue } from '@/shared/lib/xlsx';
import { buildAttendanceReport } from '../lib/attendance-report';
import { formatDateId, formatDateTimeId } from '../lib/report-format';
import { ticketStatusLabel } from '../lib/ticket-status';
import type {
  AttendanceFilters,
  AttendanceReport,
  ReportPeriod,
  UpstreamAttendancePayload,
} from '../types/report.types';

export function readAttendanceFilters(request: NextRequest): AttendanceFilters {
  const { searchParams } = new URL(request.url);
  return {
    from: searchParams.get('from') ?? '',
    to: searchParams.get('to') ?? '',
    eventId: searchParams.get('eventId') ?? '',
  };
}

export type LoadAttendanceResult =
  | { ok: true; data: AttendanceReport }
  | { ok: false; status: number; error: string };

export async function loadAttendanceReport(
  token: string,
  filters: AttendanceFilters
): Promise<LoadAttendanceResult> {
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  const endOfDay = endOfDayIso(filters.to || null);
  if (endOfDay) params.set('to', endOfDay);
  if (filters.eventId) params.set('eventId', filters.eventId);

  const query = params.toString();
  const upstream = await upstreamRequest<{ data: UpstreamAttendancePayload }>(
    `/events/attendance${query ? `?${query}` : ''}`,
    { token }
  );

  if (!upstream.ok || !upstream.data?.data) {
    return {
      ok: false,
      status: upstream.status || 502,
      error: upstream.error ?? 'Gagal memuat laporan presensi kegiatan.',
    };
  }

  const period: ReportPeriod = {
    from: filters.from || null,
    to: filters.to || null,
  };
  const data = buildAttendanceReport(
    upstream.data.data,
    period,
    new Date().toISOString()
  );

  return { ok: true, data };
}

export function buildAttendanceWorkbook(report: AttendanceReport): Buffer {
  const infoRows: XlsxCellValue[][] = [
    ['LAPORAN PRESENSI KEGIATAN — TAMAN BACA RETE MALI'],
    ['RT 05 / RW 14 Jatirangga'],
    [],
    ['Dibuat pada', formatDateTimeId(report.generatedAt)],
    [
      'Periode laporan',
      `${formatDateId(report.period.from)} s.d. ${formatDateId(report.period.to)}`,
    ],
    ['Total kegiatan', report.totals.events],
    ['Total kuota peserta', report.totals.quota],
    ['Total pendaftar', report.totals.registered],
    ['Total kehadiran', report.totals.checkedIn],
    ['Total tidak hadir', report.totals.noShow],
    ['Total pembatalan', report.totals.cancelled],
    ['Tingkat kehadiran', `${report.totals.attendanceRate}%`],
    ['Kegiatan ditutup otomatis', report.totals.autoClosedEvents],
  ];

  const summaryRows: XlsxCellValue[][] = [
    [
      'No',
      'Judul Kegiatan',
      'Kategori',
      'Tanggal',
      'Jam',
      'Lokasi',
      'Fasilitator',
      'Kuota',
      'Terdaftar',
      'Hadir',
      'Tidak Hadir',
      'Dibatalkan',
      'Kehadiran (%)',
      'Status',
    ],
  ];

  report.events.forEach((event, index) => {
    summaryRows.push([
      index + 1,
      event.title,
      event.category,
      formatDateId(event.eventDate),
      `${event.startTime} - ${event.endTime}`,
      event.location,
      event.facilitatorName,
      event.quota,
      event.activeRegistered,
      event.checkedInCount,
      event.noShowCount,
      event.cancelledCount,
      event.attendanceRate,
      event.phaseLabel,
    ]);
  });

  if (report.events.length === 0) {
    summaryRows.push([
      '-',
      'Belum ada kegiatan pada periode ini',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
  }

  const participantRows: XlsxCellValue[][] = [
    [
      'No',
      'Judul Kegiatan',
      'Tanggal Kegiatan',
      'Kode Tiket',
      'Kode Anggota',
      'Nama Peserta',
      'RT / RW',
      'Telepon',
      'Status Kehadiran',
      'Waktu Check-in',
      'Waktu Pendaftaran',
    ],
  ];

  let participantIndex = 0;
  report.events.forEach((event) => {
    event.participants.forEach((participant) => {
      participantIndex += 1;
      participantRows.push([
        participantIndex,
        event.title,
        formatDateId(event.eventDate),
        participant.ticketCode,
        participant.memberCode,
        participant.memberName,
        participant.memberRtRw ?? '-',
        participant.memberPhone ?? '-',
        ticketStatusLabel(participant.status),
        participant.checkedInAt ? formatDateTimeId(participant.checkedInAt) : '-',
        formatDateTimeId(participant.registeredAt),
      ]);
    });
  });

  if (participantIndex === 0) {
    participantRows.push([
      '-',
      'Belum ada peserta terdaftar pada periode ini',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
  }

  return buildXlsx([
    {
      name: 'Info Laporan',
      headerRow: false,
      columns: [{ width: 30 }, { width: 46 }],
      rows: infoRows,
    },
    {
      name: 'Ringkasan Event',
      freezeHeader: true,
      autoFilter: true,
      columns: [
        { width: 5 },
        { width: 40 },
        { width: 14 },
        { width: 18 },
        { width: 12 },
        { width: 30 },
        { width: 26 },
        { width: 8 },
        { width: 10 },
        { width: 8 },
        { width: 12 },
        { width: 11 },
        { width: 14 },
        { width: 26 },
      ],
      rows: summaryRows,
    },
    {
      name: 'Presensi Peserta',
      freezeHeader: true,
      autoFilter: true,
      columns: [
        { width: 5 },
        { width: 40 },
        { width: 18 },
        { width: 20 },
        { width: 16 },
        { width: 26 },
        { width: 12 },
        { width: 18 },
        { width: 18 },
        { width: 22 },
        { width: 22 },
      ],
      rows: participantRows,
    },
  ]);
}
