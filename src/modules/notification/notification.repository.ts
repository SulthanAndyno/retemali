import { PrismaClient } from "../../../generated/prisma";

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

    // 2. Notifikasi Event Baru & Event Selesai
    for (const ev of recentEvents) {
      items.push({
        id: `event-${ev.id}`,
        kind: "EVENT",
        title: `Kegiatan Baru: ${ev.title}`,
        description: `Dilaksanakan pada ${new Date(ev.eventDate).toLocaleDateString("id-ID")} pukul ${ev.startTime}-${ev.endTime} WIB. Kuota: ${ev.registeredCount}/${ev.quota} peserta.`,
        createdAt: ev.createdAt,
        severity: "info",
        href: `/kegiatan`,
      });

      if (new Date(ev.eventDate) < now) {
        items.push({
          id: `event-closed-${ev.id}`,
          kind: "EVENT_CLOSED",
          title: `Kegiatan Telah Selesai: ${ev.title}`,
          description:
            "Waktu kegiatan telah lewat. Pendaftaran otomatis ditutup.",
          createdAt: ev.eventDate,
          severity: "warning",
          href: `/kegiatan`,
        });
      }
    }

    // 3. Notifikasi Pinjaman Mendekati Jatuh Tempo
    for (const loan of userLoans) {
      items.push({
        id: `loan-due-${loan.id}`,
        kind: "LOAN_DUE",
        title: `Pengingat Pengembalian Buku: ${loan.book.title}`,
        description: `Buku "${loan.book.title}" (${loan.book.bookCode}) memiliki tenggat pengembalian pada ${new Date(loan.dueDate).toLocaleDateString("id-ID")}.`,
        createdAt: loan.borrowedAt,
        severity: "warning",
        href: `/dashboard/member`,
      });
    }

    // 4. Notifikasi Reservasi Siap Diambil
    for (const res of userReservations) {
      items.push({
        id: `res-pickup-${res.id}`,
        kind: "RESERVATION_PICKUP",
        title: `Reservasi Siap Diambil: ${res.book.title}`,
        description: `Buku reservasi siap diambil di meja perpustakaan dengan kode #${res.reservationCode}. Batas waktu 48 jam.`,
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
