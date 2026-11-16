import { NextFunction, Response } from "express";
import { successResponse } from "../../utils/response";
import { NotificationService } from "./notification.service";
import { notificationQuerySchema } from "./notification.validation";
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
}
