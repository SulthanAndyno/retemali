export type BookDonationStatus = 'PENDING_CURATION' | 'ACCEPTED' | 'REJECTED';

export interface AdminBookDonation {
  id: string;
  batchCode: string;
  donorName: string;
  packageTitle: string;
  totalBooks: number;
  conditionNote: string;
  status: BookDonationStatus;
  createdAt: string;
}
