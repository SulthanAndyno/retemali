import { get, post } from '@/shared/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';
import type {
  BookDonationInput,
  DonationSummary,
  FinancialDonationInput,
  FinancialDonationReceipt,
  FinancialDonationRecord,
  PaymentAccount,
  PhysicalBookDonationRecord,
} from '../types/donation.types';

export function getDonationSummary() {
  return get<ApiEnvelope<DonationSummary>>('/donations/summary');
}

export function getFinancialReceipt(code: string) {
  return get<ApiEnvelope<FinancialDonationReceipt>>(
    `/donations/financial/${encodeURIComponent(code)}`
  );
}

export function getPaymentAccounts() {
  return get<ApiEnvelope<PaymentAccount[]>>('/donations/payment-accounts');
}

export function createFinancialDonation(input: FinancialDonationInput) {
  const body = new FormData();
  body.append('donorName', input.donorName);
  if (input.donorEmail) body.append('donorEmail', input.donorEmail);
  body.append('isAnonymous', String(input.isAnonymous));
  body.append('amount', String(input.amount));
  body.append('purposeLabel', input.purposeLabel);
  body.append('paymentMethod', input.paymentMethod);

  return post<ApiEnvelope<FinancialDonationRecord>>('/donations/financial', body);
}

export function createBookDonation(input: BookDonationInput) {
  const body = new FormData();
  body.append('donorName', input.donorName);
  body.append('packageTitle', input.packageTitle);
  body.append('totalBooks', String(input.totalBooks));
  body.append('conditionNote', input.conditionNote);
  body.append('deliveryMethod', input.deliveryMethod);

  return post<ApiEnvelope<PhysicalBookDonationRecord>>('/donations/books', body);
}
