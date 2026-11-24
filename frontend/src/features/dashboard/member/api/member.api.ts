import { get, patch, post } from '@/shared/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';
import type { MemberDashboard, VolunteerApplicationInput } from '../types/member.types';

/** Data agregat Portal Anggota (kartu, pinjaman, pengajuan peminjaman, tiket). */
export function getMemberDashboard() {
  return get<ApiEnvelope<MemberDashboard>>('/dashboard/member');
}

/** Perpanjang pinjaman +7 hari (maksimal 1x, ditegakkan backend). */
export function extendLoan(loanId: string) {
  return patch<ApiEnvelope<unknown>>(`/circulation/loans/${loanId}/extend`);
}

/** Batalkan pengajuan peminjaman yang masih READY_FOR_PICKUP. */
export function cancelReservation(reservationId: string) {
  return patch<ApiEnvelope<unknown>>(
    `/circulation/reservations/${reservationId}/cancel`
  );
}

/** Daftar calon relawan. Backend menerima multipart/form-data. */
export function applyVolunteer(input: VolunteerApplicationInput) {
  const form = new FormData();
  form.append('majorOrJob', input.majorOrJob);
  form.append('institution', input.institution);
  form.append('division', input.division);
  form.append('motivation', input.motivation);
  if (input.cvDocument) {
    form.append('cvDocument', input.cvDocument);
  }

  return post<ApiEnvelope<unknown>>('/volunteers/apply', form);
}
