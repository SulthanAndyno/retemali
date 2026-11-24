import { AppError } from "@/middlewares/error.middleware";
import {
  buildPaginationMeta,
  parsePagination,
} from "../../utils/pagination";
import { DonationRepository } from "./donation.repository";
import {
  CreateBookDonationInput,
  CreateFinancialDonationInput,
  DonationQueryInput,
  PaymentAccountInput,
  PaymentWebhookInput,
  UpdatePaymentAccountInput,
  VerifyBookDonationInput,
  VerifyFinancialDonationInput,
} from "./donation.validation";

export class DonationService {
  private readonly donationRepository: DonationRepository;

  constructor(donationRepository: DonationRepository) {
    this.donationRepository = donationRepository;
  }

  async getPublicSummary() {
    return this.donationRepository.getPublicSummary();
  }

  async createFinancialDonation(
    data: CreateFinancialDonationInput,
    file?: Express.Multer.File,
    userId?: string,
  ) {
    const proofPath = file ? `uploads/donations/${file.filename}` : undefined;
    return this.donationRepository.createFinancialDonation(
      data,
      proofPath,
      userId,
    );
  }

  async processWebhook(payload: PaymentWebhookInput) {
    return this.donationRepository.verifyFinancialWebhook(payload);
  }

  async getReceiptByCode(receiptCode: string) {
    const receipt =
      await this.donationRepository.findByReceiptCode(receiptCode);
    if (!receipt) {
      throw new AppError("Kuitansi donasi tidak ditemukan", 404);
    }
    return receipt;
  }

  async getAllFinancialDonations(query: DonationQueryInput) {
    const { skip, take, page, limit } = parsePagination(query);
    const { data, total } =
      await this.donationRepository.findAllFinancialDonations({
        skip,
        take,
        status: query.status,
      });

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async verifyFinancialDonation(
    id: string,
    data: VerifyFinancialDonationInput,
    actorId?: string,
  ) {
    return this.donationRepository.verifyFinancialDonationById(
      id,
      data.status,
      actorId,
    );
  }

  async getBookDonationByCode(codeOrId: string) {
    const batch =
      await this.donationRepository.findBookDonationByCodeOrId(codeOrId);
    if (!batch) {
      throw new AppError("Paket donasi buku fisik tidak ditemukan", 404);
    }
    return batch;
  }

  async createBookDonation(
    data: CreateBookDonationInput,
    file?: Express.Multer.File,
    userId?: string,
  ) {
    const imagePath = file ? `uploads/donations/${file.filename}` : undefined;
    return this.donationRepository.createBookDonation(data, imagePath, userId);
  }

  async getAllBookDonations(query: DonationQueryInput) {
    const { skip, take, page, limit } = parsePagination(query);
    const { data, total } = await this.donationRepository.findAllBookDonations({
      skip,
      take,
      status: query.status,
    });

    return {
      data,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async verifyBookDonation(
    id: string,
    curatedById: string,
    data: VerifyBookDonationInput,
  ) {
    return this.donationRepository.verifyBookDonation(id, curatedById, data);
  }

  async getCashReport(from?: Date, to?: Date) {
    return this.donationRepository.getCashReport(from, to);
  }

  async getPaymentAccounts() {
    return this.donationRepository.getPaymentAccounts();
  }

  async getPaymentSetting() {
    return this.donationRepository.getPaymentSetting();
  }

  async getAdminPaymentAccounts() {
    return this.donationRepository.getAdminPaymentAccounts();
  }

  async createPaymentAccount(
    input: PaymentAccountInput,
    file?: Express.Multer.File,
  ) {
    const qrisImageUrl = file
      ? `uploads/payment-accounts/${file.filename}`
      : undefined;

    if (input.type === "QRIS" && !qrisImageUrl && !input.qrisNmid) {
      throw new AppError(
        "Kanal QRIS membutuhkan gambar QR atau NMID sebagai identitas pembayaran",
        400,
      );
    }

    return this.donationRepository.createPaymentAccount({
      ...input,
      qrisImageUrl,
    });
  }

  async updatePaymentAccount(
    id: string,
    input: UpdatePaymentAccountInput,
    file?: Express.Multer.File,
  ) {
    const qrisImageUrl = file
      ? `uploads/payment-accounts/${file.filename}`
      : undefined;

    return this.donationRepository.updatePaymentAccount(id, {
      ...input,
      qrisImageUrl,
    });
  }

  async deletePaymentAccount(id: string) {
    return this.donationRepository.deletePaymentAccount(id);
  }
}
