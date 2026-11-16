import {
  ActivityNotificationItem,
  NotificationRepository,
} from "./notification.repository";

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
}
