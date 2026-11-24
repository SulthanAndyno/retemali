import { NextFunction, Response } from "express";
import { successResponse } from "../../utils/response";
import { NotificationService } from "./notification.service";
import {
  createBroadcastSchema,
  notificationQuerySchema,
} from "./notification.validation";
import { AuthRequest } from "@/middlewares/auth.middleware";

export class NotificationController {
  private readonly notificationService: NotificationService;

  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }

  getNotifications = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = notificationQuerySchema.parse(req.query);
      const limit = query.limit ? parseInt(query.limit, 10) : 20;
      const { items, count } = await this.notificationService.getNotifications(
        req.userId as string,
        limit,
      );

      successResponse({
        res,
        message: "Berhasil mengambil daftar notifikasi aktivitas",
        data: {
          items,
          count,
          fetchedAt: new Date(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getBroadcasts = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = notificationQuerySchema.parse(req.query);
      const limit = query.limit ? parseInt(query.limit, 10) : 30;
      const items = await this.notificationService.getBroadcasts(limit);

      successResponse({
        res,
        message: "Berhasil mengambil riwayat siaran notifikasi",
        data: items,
      });
    } catch (error) {
      next(error);
    }
  };

  createBroadcast = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const input = createBroadcastSchema.parse(req.body);
      const item = await this.notificationService.createBroadcast(
        input,
        req.userId,
      );

      successResponse({
        res,
        statusCode: 201,
        message: "Siaran pengumuman berhasil dikirim",
        data: item,
      });
    } catch (error) {
      next(error);
    }
  };
}
