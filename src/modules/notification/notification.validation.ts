import { z } from "zod";

export const notificationQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).optional().default("20"),
});

export type NotificationQueryInput = z.infer<typeof notificationQuerySchema>;
