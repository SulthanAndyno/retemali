export type BookDonationStatus = 'PENDING_CURATION' | 'ACCEPTED' | 'REJECTED';
export type FinancialDonationStatus = 'PENDING' | 'VERIFIED' | 'FAILED';

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

export interface AdminFinancialDonation {
  id: string;
  receiptCode: string;
  donorName: string;
  amount: string | number;
  purposeLabel: string;
  paymentMethod: string;
  paymentStatus: FinancialDonationStatus;
  proofImage: string | null;
  createdAt: string;
}
