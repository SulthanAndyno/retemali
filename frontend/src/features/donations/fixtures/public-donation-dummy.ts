import type { PhysicalBookDonationRecord } from '../types/donation.types';

export const DUMMY_BOOK_DONATION_STATUS: Record<
  string,
  PhysicalBookDonationRecord
> = {
  'BDN-2026-0001': {
    id: 'dummy-book-donation-001',
    batchCode: 'BDN-2026-0001',
    donorName: 'Warga RW 14',
    packageTitle: '25 Buku Sains Populer',
    totalBooks: 25,
    status: 'PENDING_CURATION',
    createdAt: '2026-11-10T10:00:00.000Z',
  },
};
