export interface DonationCampaign {
  id: string;
  title: string;
  targetAmount: string | number;
  collectedAmount: string | number;
  isActive: boolean;
  auditReportPdf?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialDonationRecord {
  id: string;
  receiptCode: string;
  donorName: string;
  amount: string | number;
  paymentStatus: string;
  createdAt?: string;
}

export interface PhysicalBookDonationRecord {
  id: string;
  batchCode: string;
  donorName: string;
  packageTitle: string;
  totalBooks: number;
  status: string;
  createdAt?: string;
}

export interface FinancialDonationReceipt {
  id: string;
  receiptCode: string;
  donorName: string;
  donorEmail?: string | null;
  isAnonymous: boolean;
  amount: string | number;
  purposeLabel: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  verifiedAt?: string | null;
  campaign?: DonationCampaign | null;
}

export interface DonationSummary {
  campaign: DonationCampaign | null;
  sahabatLiterasiMembers: number;
  recentFinancialDonations: FinancialDonationRecord[];
  recentBookDonations: PhysicalBookDonationRecord[];
}

export interface PaymentAccount {
  id: string;
  type: 'QRIS' | 'BANK_TRANSFER';
  providerName: string;
  accountNumber: string | null;
  accountName: string | null;
  qrisImageUrl: string | null;
  qrisNmid: string | null;
  isActive: boolean;
  sortOrder: number;
}

export type DonationType = 'financial' | 'book';
export type PaymentMethod =
  | 'QRIS'
  | 'BANK_TRANSFER'
  | 'BANK_MANDIRI'
  | 'BANK_BCA'
  | 'GOPAY'
  | 'OVO'
  | 'DANA'
  | 'SHOPEEPAY';
export type DeliveryMethod = 'DROP_OFF' | 'COURIER';

export interface FinancialDonationInput {
  donorName: string;
  donorEmail?: string;
  isAnonymous: boolean;
  amount: number;
  purposeLabel: string;
  paymentMethod: PaymentMethod;
}

export interface BookDonationInput {
  donorName: string;
  packageTitle: string;
  totalBooks: number;
  conditionNote: string;
  deliveryMethod: DeliveryMethod;
}

export interface DonationActionResult {
  ok: boolean;
  message: string;
  receiptCode?: string;
  batchCode?: string;
}
