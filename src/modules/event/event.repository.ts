import slug from "slug";
import { AppError } from "@/middlewares/error.middleware";
import {
  CommunityEvent,
  EventRegistration,
  PaymentStatus,
  PrismaClient,
  TicketStatus,
} from "../../../generated/prisma";
import {
  CreateEventInput,
  EventCategory,
  EventFeeType,
  EventStatus,
  UpdateEventInput,
} from "./event.validation";

interface FindAllEventOptions {
  skip: number;
  take: number;
  category?: EventCategory;
  feeType?: EventFeeType;
  status?: EventStatus;
  isFeatured?: boolean;
  search?: string;
}

export class EventRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private async generateTicketCode(): Promise<string> {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const count = await this.prisma.eventRegistration.count();
    return `RETEMALI-EV-${randomNum + count}`;
  }

  async findAll(
    options: FindAllEventOptions,
  ): Promise<{ data: CommunityEvent[]; total: number }> {
    const { skip, take, category, feeType, status, isFeatured, search } =
      options;

    const where: Record<string, unknown> = {
      ...(category && { category }),
      ...(feeType && { feeType }),
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { facilitatorName: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.communityEvent.findMany({
        where,
        skip,
        take,
        orderBy: [{ isFeatured: "desc" }, { eventDate: "asc" }],
      }),
      this.prisma.communityEvent.count({ where }),
    ]);

    return { data, total };
  }

  async findByIdOrSlug(identifier: string): Promise<CommunityEvent | null> {
    return this.prisma.communityEvent.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
    });
  }

  async create(
    data: CreateEventInput,
    bannerImagePath?: string,
    actorId?: string,
  ): Promise<CommunityEvent> {
    const baseSlug = slug(data.title, { lower: true });
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.communityEvent.create({
        data: {
          title: data.title,
          slug: uniqueSlug,
          description: data.description,
          category: data.category,
          facilitatorName: data.facilitatorName,
          location: data.location,
          eventDate: data.eventDate,
          startTime: data.startTime,
          endTime: data.endTime,
          quota: data.quota,
          feeType: data.feeType,
          infaqAmount: data.infaqAmount ?? 0,
          materialsNote: data.materialsNote ?? null,
          bannerImage: bannerImagePath ?? null,
          isFeatured: data.isFeatured ?? false,
          status: data.status ?? "PUBLISHED",
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: actorId ?? null,
          title: "Penambahan Kegiatan Baru",
          description: `Kegiatan baru "${created.title}" berhasil dibuat (Kategori: ${created.category}, Kuota: ${created.quota} peserta).`,
          category: "EVENT",
        },
      });

      return created;
    });
  }

  async update(
    id: string,
    data: UpdateEventInput,
    bannerImagePath?: string,
  ): Promise<CommunityEvent> {
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.facilitatorName !== undefined)
      updateData.facilitatorName = data.facilitatorName;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.eventDate !== undefined) updateData.eventDate = data.eventDate;
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;
    if (data.quota !== undefined) updateData.quota = data.quota;
    if (data.feeType !== undefined) updateData.feeType = data.feeType;
    if (data.infaqAmount !== undefined)
      updateData.infaqAmount = data.infaqAmount;
    if (data.materialsNote !== undefined)
      updateData.materialsNote = data.materialsNote;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.status !== undefined) updateData.status = data.status;
    if (bannerImagePath !== undefined) updateData.bannerImage = bannerImagePath;

    return this.prisma.communityEvent.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string, actorId?: string): Promise<CommunityEvent> {
    return this.prisma.$transaction(async (tx) => {
      const deleted = await tx.communityEvent.delete({ where: { id } });

      await tx.auditLog.create({
        data: {
          actorId: actorId ?? null,
          title: "Penghapusan Kegiatan Komunitas",
          description: `Kegiatan "${deleted.title}" telah dihapus secara permanen dari sistem.`,
          category: "EVENT",
        },
      });

      return deleted;
    });
  }

  async registerParticipant(
    eventIdOrSlug: string,
    userId: string,
    paymentProofUrl?: string,
  ): Promise<EventRegistration> {
    const event = await this.findByIdOrSlug(eventIdOrSlug);

    if (!event) {
      throw new AppError("Kegiatan komunitas tidak ditemukan", 404);
    }

    // Guard: Auto-Closing berdasarkan Timeline
    const now = new Date();
    const eventDate = new Date(event.eventDate);
    if (eventDate < now) {
      throw new AppError(
        "Waktu pelaksanaan kegiatan sudah lewat. Pendaftaran telah ditutup otomatis.",
        400,
      );
    }

    if (
      event.status === "COMPLETED" ||
      event.status === "CANCELLED" ||
      event.status === "DRAFT"
    ) {
      throw new AppError(
        "Pendaftaran untuk kegiatan ini sedang tidak dibuka.",
        400,
      );
    }

    // Guard: Pembatasan Kuota Peserta
    if (event.registeredCount >= event.quota) {
      throw new AppError("Kuota kursi kegiatan ini sudah penuh", 400);
    }

    const existing = await this.prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: { eventId: event.id, userId },
      },
    });

    if (existing) {
      throw new AppError("Anda sudah terdaftar pada kegiatan ini", 400);
    }

    const ticketCode = await this.generateTicketCode();

    // Tentukan paymentStatus untuk kegiatan berbayar vs gratis
    const isPaidEvent =
      event.feeType === "INFAQ" && Number(event.infaqAmount) > 0;
    const initialPaymentStatus: PaymentStatus | null = isPaidEvent
      ? "PENDING"
      : null;

    return this.prisma.$transaction(async (tx) => {
      await tx.communityEvent.update({
        where: { id: event.id },
        data: { registeredCount: { increment: 1 } },
      });

      return tx.eventRegistration.create({
        data: {
          ticketCode,
          eventId: event.id,
          userId,
          status: "REGISTERED",
          paymentProofUrl: paymentProofUrl ?? null,
          paymentStatus: initialPaymentStatus,
        },
        include: {
          event: true,
          user: {
            select: { id: true, name: true, email: true, memberCode: true },
          },
        },
      });
    });
  }

  async findTicketsByUser(userId: string): Promise<EventRegistration[]> {
    return this.prisma.eventRegistration.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async checkInParticipant(
    ticketCode: string,
    checkedInBy: string,
  ): Promise<EventRegistration> {
    const ticket = await this.prisma.eventRegistration.findUnique({
      where: { ticketCode },
      include: { event: true, user: true },
    });

    if (!ticket) {
      throw new AppError(
        `Tiket dengan kode "${ticketCode}" tidak ditemukan`,
        404,
      );
    }

    if (ticket.status === "CHECKED_IN") {
      throw new AppError("Peserta ini sudah melakukan check-in sebelumnya", 400);
    }

    return this.prisma.eventRegistration.update({
      where: { id: ticket.id },
      data: {
        status: "CHECKED_IN",
        checkedInAt: new Date(),
        checkedInBy,
      },
      include: {
        event: true,
        user: {
          select: { id: true, memberCode: true, name: true, rtRw: true },
        },
      },
    });
  }

  async submitReport(
    eventId: string,
    reportSummary: string,
  ): Promise<CommunityEvent> {
    return this.prisma.communityEvent.update({
      where: { id: eventId },
      data: {
        reportSummary,
        status: "COMPLETED",
      },
    });
  }

  async approveReport(eventId: string): Promise<CommunityEvent> {
    return this.prisma.communityEvent.update({
      where: { id: eventId },
      data: {
        reportApproved: true,
      },
    });
  }

  /**
   * Rekap Laporan Presensi Kegiatan (Attendance Report)
   */
  async getAttendanceReport(options: {
    from?: Date;
    to?: Date;
    eventId?: string;
  }) {
    const { from, to, eventId } = options;

    const where: Record<string, unknown> = {};
    if (eventId) {
      where.id = eventId;
    }
    if (from || to) {
      where.eventDate = {
        ...(from && { gte: from }),
        ...(to && { lte: to }),
      };
    }

    const events = await this.prisma.communityEvent.findMany({
      where,
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                memberCode: true,
                phone: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { eventDate: "desc" },
    });

    let totalRegisteredAll = 0;
    let totalAttendedAll = 0;

    const formattedEvents = events.map((event) => {
      const registered = event.registrations.length;
      const attended = event.registrations.filter(
        (r) => r.status === "CHECKED_IN" || r.checkedInAt !== null,
      ).length;

      totalRegisteredAll += registered;
      totalAttendedAll += attended;

      const attendanceRate =
        registered > 0 ? Math.round((attended / registered) * 100) : 0;

      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        category: event.category,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        quota: event.quota,
        registeredCount: registered,
        attendedCount: attended,
        attendanceRate: `${attendanceRate}%`,
        status: event.status,
        participants: event.registrations.map((reg) => ({
          registrationId: reg.id,
          ticketCode: reg.ticketCode,
          user: reg.user,
          status: reg.status,
          checkedInAt: reg.checkedInAt,
          paymentProofUrl: reg.paymentProofUrl,
          paymentStatus: reg.paymentStatus,
          registeredAt: reg.createdAt,
        })),
      };
    });

    const overallRate =
      totalRegisteredAll > 0
        ? Math.round((totalAttendedAll / totalRegisteredAll) * 100)
        : 0;

    return {
      period: {
        from: from ? from.toISOString() : null,
        to: to ? to.toISOString() : null,
      },
      summary: {
        totalEvents: events.length,
        totalRegistered: totalRegisteredAll,
        totalAttended: totalAttendedAll,
        overallAttendanceRate: `${overallRate}%`,
      },
      events: formattedEvents,
    };
  }

  /**
   * Mengambil daftar pendaftaran kegiatan (khusus verifikasi pembayaran & admin)
   */
  async getRegistrations(options: {
    eventId?: string;
    status?: TicketStatus;
    paymentStatus?: PaymentStatus;
    skip: number;
    take: number;
  }) {
    const { eventId, status, paymentStatus, skip, take } = options;

    const where: Record<string, unknown> = {
      ...(eventId && { eventId }),
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.eventRegistration.findMany({
        where,
        skip,
        take,
        include: {
          event: {
            select: {
              id: true,
              title: true,
              feeType: true,
              infaqAmount: true,
              eventDate: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              memberCode: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.eventRegistration.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Verifikasi Pembayaran Tiket Kegiatan Berbayar
   */
  async verifyRegistrationPayment(
    registrationId: string,
    status: "VERIFIED" | "FAILED",
    paymentNote?: string,
    verifiedById?: string,
  ) {
    const reg = await this.prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: { event: true, user: true },
    });

    if (!reg) {
      throw new AppError("Data pendaftaran kegiatan tidak ditemukan", 404);
    }

    return this.prisma.$transaction(async (tx) => {
      // Jika ditolak (FAILED), kembalikan kuota event dan batalkan tiket
      if (status === "FAILED") {
        await tx.communityEvent.update({
          where: { id: reg.eventId },
          data: { registeredCount: { decrement: 1 } },
        });
      }

      const updated = await tx.eventRegistration.update({
        where: { id: registrationId },
        data: {
          paymentStatus: status,
          paymentNote: paymentNote ?? null,
          verifiedById: verifiedById ?? null,
          verifiedAt: new Date(),
          status: status === "FAILED" ? "CANCELLED" : reg.status,
        },
        include: { event: true, user: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: verifiedById ?? null,
          title:
            status === "VERIFIED"
              ? "Verifikasi Pembayaran Kegiatan Disetujui"
              : "Verifikasi Pembayaran Kegiatan Ditolak",
          description: `Pendaftaran ${reg.user.name} pada event "${reg.event.title}" (${reg.ticketCode}) berstatus ${status}. Catatan: ${paymentNote ?? "-"}`,
          category: "EVENT",
        },
      });

      return updated;
    });
  }

  /**
   * Evaluasi Status & Timeline Otomatis untuk Semua Event
   */
  async getAutoCloseEvaluations() {
    const events = await this.prisma.communityEvent.findMany({
      orderBy: { eventDate: "asc" },
    });

    const now = new Date();

    return events.map((event) => {
      const eventDate = new Date(event.eventDate);
      const isTimelinePassed = eventDate < now;
      const isQuotaFull = event.registeredCount >= event.quota;
      const seatsLeft = Math.max(0, event.quota - event.registeredCount);

      let phase = "UPCOMING";
      if (isTimelinePassed || event.status === "COMPLETED") {
        phase = "CLOSED";
      } else if (isQuotaFull) {
        phase = "QUOTA_FULL";
      }

      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        quota: event.quota,
        registeredCount: event.registeredCount,
        seatsLeft,
        isQuotaFull,
        isAutoClosed: isTimelinePassed,
        isRegistrationOpen:
          !isTimelinePassed &&
          !isQuotaFull &&
          event.status === "PUBLISHED",
        phase,
      };
    });
  }
}
