import {
  ActivityNotificationItem,
  BroadcastNotificationItem,
  NotificationRepository,
} from "./notification.repository";
import { CreateBroadcastInput } from "./notification.validation";

export class NotificationService {
  private readonly notificationRepository: NotificationRepository;

  constructor(notificationRepository: NotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async getNotifications(
    userId: string,
    limit: number = 20,
  ): Promise<{ items: ActivityNotificationItem[]; count: number }> {
    const items = await this.notificationRepository.getNotificationsForUser(
      userId,
      limit,
    );
    return {
      items,
      count: items.length,
    };
  }

  async getBroadcasts(limit: number = 30): Promise<BroadcastNotificationItem[]> {
    return this.notificationRepository.getBroadcasts(limit);
  }

  async createBroadcast(
    input: CreateBroadcastInput,
    actorId?: string,
  ): Promise<BroadcastNotificationItem> {
    return this.notificationRepository.createBroadcast(input, actorId);
  }
}
