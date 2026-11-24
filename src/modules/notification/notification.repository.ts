import { PrismaClient } from "../../../generated/prisma";
import {
  combineEventDateTimeWib,
  formatCloseRule,
  formatDateTimeWib,
  formatDateWib,
  getEventRegistrationCutoffWib,
  normalizeCloseOffsetDays,
} from "../../utils/date-wib";
import { CreateBroadcastInput } from "./notification.validation";

export interface ActivityNotificationItem {
  id: string;
  kind: "AUDIT" | "EVENT" | "EVENT_CLOSED" | "LOAN_DUE" | "RESERVATION_PICKUP";
  title: string;
  description: string;
  createdAt: Date;
  severity: "info" | "warning" | "success" | "error";
  href: string | null;
}

export interface BroadcastNotificationItem {
  id: string;
  title: string;
  description: string;
  target: string;
  sentAt: string;
  createdAt: Date;
}

export class NotificationRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getNotificationsForUser(
    userId: string,
    limit: number = 20,
  ): Promise<ActivityNotificationItem[]> {
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    const [auditLogs, recentEvents, userLoans, userReservations] =
      await Promise.all([
        this.prisma.auditLog.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
        }),
        this.prisma.communityEvent.findMany({
          where: {
            createdAt: { gte: fourteenDaysAgo },
          },
          take: 10,
          orderBy: { createdAt: "desc" },
        }),
        this.prisma.bookLoan.findMany({
          where: {
            userId,
            status: "BORROWED",
            dueDate: { lte: twoDaysFromNow },
          },
          include: { book: { select: { title: true, bookCode: true } } },
          orderBy: { dueDate: "asc" },
        }),
        this.prisma.bookReservation.findMany({
          where: {
            userId,
            status: "READY_FOR_PICKUP",
          },
          include: { book: { select: { title: true } } },
          orderBy: { createdAt: "desc" },
        }),
      ]);

    const items: ActivityNotificationItem[] = [];

    // 1. Notifikasi Audit Aktivitas
    for (const log of auditLogs) {
      let severity: "info" | "warning" | "success" | "error" = "info";
      if (log.category === "DONATION") severity = "success";
      if (log.category === "CIRCULATION") severity = "warning";

      items.push({
        id: `audit-${log.id}`,
        kind: "AUDIT",
        title: log.title,
        description: log.description,
        createdAt: log.createdAt,
        severity,
        href: null,
      });
    }

    // 2. Notifikasi Event Baru & Penutupan Pendaftaran (H-N, WIB)
    for (const ev of recentEvents) {
      const eventStartWib = combineEventDateTimeWib(ev.eventDate, ev.startTime);
      const closeOffsetDays = normalizeCloseOffsetDays(
        ev.registrationCloseOffsetDays,
      );
      const closeRule = formatCloseRule(closeOffsetDays);
      const cutoffWib = getEventRegistrationCutoffWib(
        ev.eventDate,
        ev.startTime,
        closeOffsetDays,
      );

      items.push({
        id: `event-${ev.id}`,
        kind: "EVENT",
        title: `Kegiatan Baru: ${ev.title}`,
        description: `Dilaksanakan pada ${formatDateWib(ev.eventDate)} pukul ${ev.startTime}-${ev.endTime} WIB. Penutupan pendaftaran ${closeRule}: ${formatDateTimeWib(cutoffWib)}. Kuota: ${ev.registeredCount}/${ev.quota} peserta.`,
        createdAt: ev.createdAt,
        severity: "info",
        href: `/kegiatan`,
      });

      if (now >= eventStartWib) {
        items.push({
          id: `event-closed-${ev.id}`,
          kind: "EVENT_CLOSED",
          title: `Kegiatan Telah Selesai: ${ev.title}`,
          description:
            "Waktu pelaksanaan kegiatan telah lewat (WIB). Pendaftaran ditutup otomatis.",
          createdAt: ev.eventDate,
          severity: "warning",
          href: `/kegiatan`,
        });
      } else if (now >= cutoffWib) {
        items.push({
          id: `event-closed-cutoff-${ev.id}`,
          kind: "EVENT_CLOSED",
          title: `Pendaftaran Ditutup Otomatis (${closeRule}): ${ev.title}`,
          description: `Batas pendaftaran ${closeRule} (${formatDateTimeWib(cutoffWib)}) telah terlewati. Pendaftaran kegiatan ditutup otomatis.`,
          createdAt: cutoffWib,
          severity: "warning",
          href: `/kegiatan`,
        });
      }
    }

    // 3. Notifikasi Pinjaman Mendekati Jatuh Tempo (WIB)
    for (const loan of userLoans) {
      items.push({
        id: `loan-due-${loan.id}`,
        kind: "LOAN_DUE",
        title: `Pengingat Pengembalian Buku: ${loan.book.title}`,
        description: `Buku "${loan.book.title}" (${loan.book.bookCode}) memiliki tenggat pengembalian pada ${formatDateWib(loan.dueDate)} WIB.`,
        createdAt: loan.borrowedAt,
        severity: "warning",
        href: `/dashboard/member`,
      });
    }

    // 4. Notifikasi Peminjaman Siap Diambil
    for (const res of userReservations) {
      items.push({
        id: `res-pickup-${res.id}`,
        kind: "RESERVATION_PICKUP",
        title: `Pengajuan Peminjaman Siap Diambil: ${res.book.title}`,
        description: `Buku siap diambil di meja sirkulasi dengan kode #${res.reservationCode}. Batas waktu pengambilan 48 jam (${formatDateTimeWib(res.expiresAt)}).`,
        createdAt: res.createdAt,
        severity: "success",
        href: `/dashboard/member`,
      });
    }

    // Sort by latest createdAt
    items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return items.slice(0, limit);
  }

  private mapAuditToBroadcast(log: {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
  }): BroadcastNotificationItem {
    const match = log.description.match(/^\[Target:\s*([^\]]+)\]\s*([\s\S]*)$/);
    const target = match?.[1]?.trim() || "Semua Anggota & Relawan";
    const description = match?.[2]?.trim() || log.description;

    return {
      id: log.id,
      title: log.title,
      description,
      target,
      sentAt: formatDateTimeWib(log.createdAt),
      createdAt: log.createdAt,
    };
  }

  async getBroadcasts(limit: number = 30): Promise<BroadcastNotificationItem[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        category: { in: ["BROADCAST", "EVENT", "SYSTEM"] },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return logs.map((log) => this.mapAuditToBroadcast(log));
  }

  async createBroadcast(
    input: CreateBroadcastInput,
    actorId?: string,
  ): Promise<BroadcastNotificationItem> {
    const log = await this.prisma.auditLog.create({
      data: {
        actorId: actorId ?? null,
        title: input.title,
        description: `[Target: ${input.target}] ${input.description}`,
        category: "BROADCAST",
      },
    });

    return this.mapAuditToBroadcast(log);
  }
}
