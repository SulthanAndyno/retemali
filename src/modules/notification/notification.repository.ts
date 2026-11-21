import { PrismaClient } from "../../../generated/prisma";
import {
  combineEventDateTimeWib,
  EVENT_CLOSE_DAYS_BEFORE,
  formatDateTimeWib,
  formatDateWib,
  getEventRegistrationCutoffWib,
} from "../../utils/date-wib";

export interface ActivityNotificationItem {
  id: string;
  kind: "AUDIT" | "EVENT" | "EVENT_CLOSED" | "LOAN_DUE" | "RESERVATION_PICKUP";
  title: string;
  description: string;
  createdAt: Date;
  severity: "info" | "warning" | "success" | "error";
  href: string | null;
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

    // 2. Notifikasi Event Baru & Penutupan Event H-3 (WIB)
    for (const ev of recentEvents) {
      const eventStartWib = combineEventDateTimeWib(ev.eventDate, ev.startTime);
      const cutoffH3Wib = getEventRegistrationCutoffWib(
        ev.eventDate,
        ev.startTime,
        EVENT_CLOSE_DAYS_BEFORE,
      );

      items.push({
        id: `event-${ev.id}`,
        kind: "EVENT",
        title: `Kegiatan Baru: ${ev.title}`,
        description: `Dilaksanakan pada ${formatDateWib(ev.eventDate)} pukul ${ev.startTime}-${ev.endTime} WIB. Penutupan pendaftaran H-3: ${formatDateTimeWib(cutoffH3Wib)}. Kuota: ${ev.registeredCount}/${ev.quota} peserta.`,
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
      } else if (now >= cutoffH3Wib) {
        items.push({
          id: `event-closed-h3-${ev.id}`,
          kind: "EVENT_CLOSED",
          title: `Pendaftaran Ditutup Otomatis (H-3): ${ev.title}`,
          description: `Batas pendaftaran H-3 (${formatDateTimeWib(cutoffH3Wib)}) telah terlewati. Pendaftaran kegiatan ditutup otomatis.`,
          createdAt: cutoffH3Wib,
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

    // 4. Notifikasi Peminjaman / Reservasi Siap Diambil
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
}
