import { NextFunction, Response } from "express";
import { paginatedResponse, successResponse } from "../../utils/response";
import { DonationService } from "./donation.service";
import {
  cashReportQuerySchema,
  createBookDonationSchema,
  createFinancialDonationSchema,
  donationQuerySchema,
  paymentAccountSchema,
  paymentWebhookSchema,
  updatePaymentAccountSchema,
  verifyBookDonationSchema,
  verifyFinancialDonationSchema,
} from "./donation.validation";
import { AuthRequest } from "@/middlewares/auth.middleware";

export class DonationController {
  private readonly donationService: DonationService;

  constructor(donationService: DonationService) {
    this.donationService = donationService;
  }

  getSummary = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const summary = await this.donationService.getPublicSummary();
      successResponse({
        res,
        message: "Berhasil mengambil ringkasan capaian donasi & jejak kebaikan",
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  };

  createFinancial = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = createFinancialDonationSchema.parse(req.body);
      const donation = await this.donationService.createFinancialDonation(
        data,
        req.file,
        req.userId,
      );

      successResponse({
        res,
        statusCode: 201,
        message: "Transaksi donasi finansial berhasil dicatat",
        data: donation,
      });
    } catch (error) {
      next(error);
    }
  };

  webhook = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = paymentWebhookSchema.parse(req.body);
      const donation = await this.donationService.processWebhook(payload);

      successResponse({
        res,
        message: "Status pembayaran donasi berhasil diperbarui",
        data: donation,
      });
    } catch (error) {
      next(error);
    }
  };

  getReceipt = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const receiptCode = req.params["receiptCode"] as string;
      const receipt = await this.donationService.getReceiptByCode(receiptCode);

      successResponse({
        res,
        message: "Berhasil mengambil kuitansi digital donasi",
        data: receipt,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllFinancialDonations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = donationQuerySchema.parse(req.query);
      const { data, meta } =
        await this.donationService.getAllFinancialDonations(query);

      paginatedResponse({
        res,
        message: "Berhasil mengambil daftar transaksi donasi finansial",
        data,
        meta,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyFinancialDonation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      const data = verifyFinancialDonationSchema.parse(req.body);
      const donation = await this.donationService.verifyFinancialDonation(
        id,
        data,
        req.userId,
      );

      successResponse({
        res,
        message: "Status pembayaran donasi finansial berhasil diperbarui",
        data: donation,
      });
    } catch (error) {
      next(error);
    }
  };

  getBookDonationByCode = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const batchCode = req.params["batchCode"] as string;
      const batch =
        await this.donationService.getBookDonationByCode(batchCode);

      successResponse({
        res,
        message: "Berhasil mengambil detail paket donasi buku fisik",
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  };

  createBookDonation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = createBookDonationSchema.parse(req.body);
      const batch = await this.donationService.createBookDonation(
        data,
        req.file,
        req.userId,
      );

      successResponse({
        res,
        statusCode: 201,
        message:
          "Pendataan donasi buku fisik berhasil dikirim dan menunggu kurasi relawan",
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllBookDonations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = donationQuerySchema.parse(req.query);
      const { data, meta } =
        await this.donationService.getAllBookDonations(query);

      paginatedResponse({
        res,
        message: "Berhasil mengambil daftar donasi buku fisik",
        data,
        meta,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyBookDonation = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      const data = verifyBookDonationSchema.parse(req.body);
      const batch = await this.donationService.verifyBookDonation(
        id,
        req.userId as string,
        data,
      );

      successResponse({
        res,
        message: "Batch donasi buku fisik berhasil diverifikasi oleh relawan",
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  };

  getCashReport = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { from, to } = cashReportQuerySchema.parse(req.query);
      const report = await this.donationService.getCashReport(from, to);

      successResponse({
        res,
        message: "Berhasil mengambil rekap laporan kas terpadu",
        data: report,
      });
    } catch (error) {
      next(error);
    }
  };

  getPaymentAccounts = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const accounts = await this.donationService.getPaymentAccounts();

      successResponse({
        res,
        message: "Berhasil mengambil daftar kanal rekening donasi",
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  };

  getPaymentSetting = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const setting = await this.donationService.getPaymentSetting();

      successResponse({
        res,
        message: "Berhasil mengambil data pengaturan rekening pembayaran",
        data: setting,
      });
    } catch (error) {
      next(error);
    }
  };

  getAdminPaymentAccounts = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const accounts = await this.donationService.getAdminPaymentAccounts();
      successResponse({
        res,
        message: "Berhasil mengambil seluruh kanal pembayaran",
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  };

  createPaymentAccount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = paymentAccountSchema.parse(req.body);
      const account = await this.donationService.createPaymentAccount(
        data,
        req.file,
      );

      successResponse({
        res,
        statusCode: 201,
        message: "Kanal pembayaran berhasil ditambahkan",
        data: account,
      });
    } catch (error) {
      next(error);
    }
  };

  updatePaymentAccount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = updatePaymentAccountSchema.parse(req.body);
      const account = await this.donationService.updatePaymentAccount(
        String(req.params.id),
        data,
        req.file,
      );

      successResponse({
        res,
        message: "Kanal pembayaran berhasil diperbarui",
        data: account,
      });
    } catch (error) {
      next(error);
    }
  };

  deletePaymentAccount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const account = await this.donationService.deletePaymentAccount(
        String(req.params.id),
      );

      successResponse({
        res,
        message: "Kanal pembayaran berhasil dihapus",
        data: account,
      });
    } catch (error) {
      next(error);
    }
  };
}
