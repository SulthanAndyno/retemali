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
import {
  combineEventDateTimeWib,
  DAY_IN_MS,
  formatCloseRule,
  formatDateTimeWib,
  getEventRegistrationCutoffWib,
  normalizeCloseOffsetDays,
  toWibIsoString,
  WIB_TIMEZONE,
} from "../../utils/date-wib";
import { normalizeGalleryImageUrl } from "../../utils/google-drive";

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

  /**
   * Menerbitkan kode E-Tiket unik berformat `TKT-XXXXXX`.
   * Kode diperiksa ke database dan diulang bila bentrok, karena kolom
   * `ticketCode` bersifat unik — pola lama (angka acak + jumlah baris) bisa
   * menghasilkan duplikat dan menggagalkan pendaftaran.
   */
  private async generateTicketCode(): Promise<string> {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const random = Math.random().toString(36).slice(2, 8).toUpperCase();
      const candidate = `TKT-${random}`;
      const existing = await this.prisma.eventRegistration.findUnique({
        where: { ticketCode: candidate },
        select: { id: true },
      });
      if (!existing) return candidate;
    }
    throw new AppError(
      "Gagal menerbitkan kode tiket unik. Silakan coba lagi.",
      503,
    );
  }

  /**
   * Menghitung status penutupan otomatis pendaftaran dalam zona waktu WIB
   * (Asia/Jakarta). Offset H-N diambil dari `registrationCloseOffsetDays`
   * milik kegiatan (1, 2, atau 3 hari sebelum pelaksanaan).
   */
  private evaluateEventTimelineWib(
    event: CommunityEvent,
    now: Date = new Date(),
  ) {
    const startsAt = combineEventDateTimeWib(event.eventDate, event.startTime);
    let endsAt = combineEventDateTimeWib(
      event.eventDate,
      event.endTime || event.startTime,
    );
    if (endsAt.getTime() <= startsAt.getTime()) {
      endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000);
    }

    const closeOffsetDays = normalizeCloseOffsetDays(
      event.registrationCloseOffsetDays,
    );
    const closeRule = formatCloseRule(closeOffsetDays);

    const registrationCloseAt = getEventRegistrationCutoffWib(
      event.eventDate,
      event.startTime,
      closeOffsetDays,
    );

    const isEventEnded = now.getTime() >= endsAt.getTime();
    const isEventOngoing =
      now.getTime() >= startsAt.getTime() && now.getTime() < endsAt.getTime();
    const isRegistrationCutoffPassed =
      now.getTime() >= registrationCloseAt.getTime();
    const isQuotaFull = event.registeredCount >= event.quota;
    const seatsLeft = Math.max(0, event.quota - event.registeredCount);

    let phase = "UPCOMING";
    let label = "Akan Datang";
    let closedReason: string | null = null;

    if (event.status === "CANCELLED") {
      phase = "CANCELLED";
      label = "Dibatalkan";
      closedReason = "Kegiatan dibatalkan oleh panitia.";
    } else if (event.status === "DRAFT") {
      phase = "DRAFT";
      label = "Draf";
      closedReason = "Kegiatan masih berstatus draf dan belum dipublikasikan.";
    } else if (event.status === "COMPLETED") {
      phase = "COMPLETED";
      label = "Selesai";
      closedReason = "Kegiatan telah ditandai selesai oleh panitia.";
    } else if (isEventEnded) {
      phase = "ENDED";
      label = "Selesai • Ditutup Otomatis";
      closedReason =
        "Waktu pelaksanaan kegiatan telah berakhir — pendaftaran ditutup otomatis.";
    } else if (isEventOngoing) {
      phase = "ONGOING";
      label = `Sedang Berlangsung • Pendaftaran Ditutup (${closeRule})`;
      closedReason = `Kegiatan sedang berlangsung dan pendaftaran telah ditutup sejak ${closeRule}.`;
    } else if (isRegistrationCutoffPassed) {
      phase = "ENDED";
      label = `Pendaftaran Ditutup Otomatis (${closeRule})`;
      closedReason = `Pendaftaran ditutup otomatis pada ${closeRule} sebelum pelaksanaan (${formatDateTimeWib(registrationCloseAt)}).`;
    } else if (isQuotaFull) {
      phase = "QUOTA_FULL";
      label = "Kuota Penuh";
      closedReason = "Kuota peserta sudah penuh.";
    }

    const isAutoClosed = isRegistrationCutoffPassed || isEventEnded;
    const isRegistrationOpen =
      !isAutoClosed && !isQuotaFull && event.status === "PUBLISHED";

    return {
      startsAt,
      endsAt,
      registrationCloseAt,
      closeOffsetDays,
      closeRule,
      isEventEnded,
      isRegistrationCutoffPassed,
      isQuotaFull,
      seatsLeft,
      isAutoClosed,
      isRegistrationOpen,
      phase,
      label,
      closedReason,
      timezone: WIB_TIMEZONE,
    };
  }

  /**
   * Memperkaya objek registrasi/tiket dengan informasi kredensial tiket,
   * harga tiket masuk, dan bukti pembayaran yang siap dicetak.
   */
  private enrichTicketCredential<
    T extends EventRegistration & {
      event?: CommunityEvent;
      user?: {
        id: string;
        name: string;
        email?: string;
        memberCode: string;
        rtRw?: string | null;
      };
    },
  >(registration: T) {
    const isPaidEvent =
      registration.event?.feeType === "PAID" &&
      Number(registration.event?.ticketPrice ?? 0) > 0;

    const credentialStatus =
      registration.status === "CANCELLED" ||
      registration.paymentStatus === "FAILED"
        ? "INVALID_OR_REJECTED"
        : isPaidEvent && registration.paymentStatus === "PENDING"
          ? "PENDING_PAYMENT_VERIFICATION"
          : registration.status === "CHECKED_IN"
            ? "USED_CHECKED_IN"
            : "ACTIVE_VALID";

    /**
     * Label status pembayaran yang dipakai di bukti pembayaran & E-Tiket.
     * Kegiatan gratis tidak pernah menunggu verifikasi: statusnya langsung
     * TERVERIFIKASI (tanpa pembayaran).
     */
    const paymentStatusLabel = !isPaidEvent
      ? "GRATIS — TERVERIFIKASI"
      : registration.paymentStatus === "VERIFIED"
        ? "LUNAS / TERVERIFIKASI"
        : registration.paymentStatus === "FAILED"
          ? "PEMBAYARAN DITOLAK"
          : "MENUNGGU VERIFIKASI";

    const eventStart = registration.event
      ? combineEventDateTimeWib(
          registration.event.eventDate,
          registration.event.startTime,
        )
      : null;

    return {
      ...registration,
      ticketCredential: {
        ticketCode: registration.ticketCode,
        credentialStatus,
        isPaymentRequired: isPaidEvent,
        ticketPrice: Number(registration.event?.ticketPrice ?? 0),
        hasPaymentProof: Boolean(registration.paymentProofUrl),
        paymentProofUrl: registration.paymentProofUrl,
        paymentStatus: isPaidEvent
          ? (registration.paymentStatus ?? "PENDING")
          : "FREE_VERIFIED",
        paymentStatusLabel,
        paymentNote: registration.paymentNote ?? null,
        verifiedAt: registration.verifiedAt
          ? toWibIsoString(registration.verifiedAt)
          : null,
        verifiedAtWib: registration.verifiedAt
          ? formatDateTimeWib(registration.verifiedAt)
          : null,
        issuedAtWib: formatDateTimeWib(registration.createdAt),
        checkedInAtWib: registration.checkedInAt
          ? formatDateTimeWib(registration.checkedInAt)
          : null,
        participantName: registration.user?.name ?? null,
        participantCode: registration.user?.memberCode ?? null,
        eventTitle: registration.event?.title ?? null,
        eventScheduleWib: registration.event
          ? `${formatDateTimeWib(eventStart ?? registration.event.eventDate)} – ${registration.event.endTime} WIB`
          : null,
        eventLocation: registration.event?.location ?? null,
        eventDateWib: registration.event
          ? formatDateTimeWib(registration.event.eventDate)
          : null,
      },
    };
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

    // Read-only list + count: Promise.all instead of $transaction so a
    // transaction-mode connection pooler cannot fail the request with P2028.
    const [data, total] = await Promise.all([
      this.prisma.communityEvent.findMany({
        where,
        skip,
        take,
        orderBy: [{ eventDate: "desc" }, { createdAt: "desc" }],
      }),
      this.prisma.communityEvent.count({ where }),
    ]);

    const now = new Date();
    const enrichedData = data.map((ev) => {
      const evalTimeline = this.evaluateEventTimelineWib(ev, now);
      return {
        ...ev,
        registrationCloseAt: toWibIsoString(evalTimeline.registrationCloseAt),
        isAutoClosed: evalTimeline.isAutoClosed,
        isRegistrationOpen: evalTimeline.isRegistrationOpen,
        closedReason: evalTimeline.closedReason,
        closeRule: evalTimeline.closeRule,
      };
    });

    return { data: enrichedData as unknown as CommunityEvent[], total };
  }

  async findByIdOrSlug(identifier: string): Promise<CommunityEvent | null> {
    const event = await this.prisma.communityEvent.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
    });
    if (!event) return null;

    const evalTimeline = this.evaluateEventTimelineWib(event);
    return {
      ...event,
      registrationCloseAt: toWibIsoString(evalTimeline.registrationCloseAt),
      isAutoClosed: evalTimeline.isAutoClosed,
      isRegistrationOpen: evalTimeline.isRegistrationOpen,
      closedReason: evalTimeline.closedReason,
      closeRule: evalTimeline.closeRule,
    } as unknown as CommunityEvent;
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
          ticketPrice: data.ticketPrice ?? data.infaqAmount ?? 0,
          registrationCloseOffsetDays: data.registrationCloseOffsetDays ?? 1,
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
    if (data.ticketPrice !== undefined) updateData.ticketPrice = data.ticketPrice;
    else if (data.infaqAmount !== undefined)
      updateData.ticketPrice = data.infaqAmount;
    if (data.registrationCloseOffsetDays !== undefined)
      updateData.registrationCloseOffsetDays =
        normalizeCloseOffsetDays(data.registrationCloseOffsetDays);
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
    paymentNote?: string,
  ): Promise<EventRegistration> {
    if (!userId) {
      throw new AppError(
        "Kredensial pengguna wajib disertakan untuk mendaftar dan menerbitkan tiket kegiatan",
        401,
      );
    }

    const event = await this.prisma.communityEvent.findFirst({
      where: {
        OR: [{ id: eventIdOrSlug }, { slug: eventIdOrSlug }],
      },
    });

    if (!event) {
      throw new AppError("Kegiatan komunitas tidak ditemukan", 404);
    }

    // 1. Guard: Auto-Closing H-3 berdasarkan Waktu Indonesia Barat (WIB)
    const now = new Date();
    const timeline = this.evaluateEventTimelineWib(event, now);

    if (timeline.isEventEnded || now >= timeline.startsAt) {
      throw new AppError(
        "Waktu pelaksanaan kegiatan sudah lewat atau sedang berlangsung. Pendaftaran telah ditutup otomatis.",
        400,
      );
    }

    if (timeline.isRegistrationCutoffPassed) {
      throw new AppError(
        `Pendaftaran kegiatan telah ditutup otomatis pada ${timeline.closeRule} sebelum hari pelaksanaan (Batas akhir: ${formatDateTimeWib(timeline.registrationCloseAt)}).`,
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

    // 2. Guard: Pembatasan Kuota Peserta
    if (event.registeredCount >= event.quota) {
      throw new AppError("Kuota kegiatan ini sudah penuh", 400);
    }

    const existing = await this.prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: { eventId: event.id, userId },
      },
    });

    if (existing) {
      throw new AppError("Anda sudah terdaftar pada kegiatan ini", 400);
    }

    // 3. Guard: wajib bukti pembayaran untuk kegiatan dengan tiket masuk berbayar
    const isPaidEvent =
      event.feeType === "PAID" && Number(event.ticketPrice) > 0;

    const normalizedProofUrl = paymentProofUrl
      ? normalizeGalleryImageUrl(paymentProofUrl)
      : undefined;

    if (isPaidEvent && !normalizedProofUrl) {
      throw new AppError(
        "Kegiatan ini memerlukan Pembayaran Tiket Masuk. Wajib melampirkan bukti transfer (unggah file paymentProof atau sertakan paymentProofUrl) untuk menerbitkan kredensial E-Tiket.",
        400,
      );
    }

    const ticketCode = await this.generateTicketCode();
    const initialPaymentStatus: PaymentStatus | null = isPaidEvent
      ? "PENDING"
      : null;

    const created = await this.prisma.$transaction(async (tx) => {
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
          paymentProofUrl: normalizedProofUrl ?? null,
          paymentStatus: initialPaymentStatus,
          paymentNote: paymentNote ?? null,
        },
        include: {
          event: true,
          user: {
            select: { id: true, name: true, email: true, memberCode: true },
          },
        },
      });
    });

    return this.enrichTicketCredential(created) as unknown as EventRegistration;
  }

  async findTicketsByUser(userId: string): Promise<EventRegistration[]> {
    const tickets = await this.prisma.eventRegistration.findMany({
      where: { userId },
      include: {
        event: true,
        user: {
          select: { id: true, name: true, email: true, memberCode: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return tickets.map((t) =>
      this.enrichTicketCredential(t),
    ) as unknown as EventRegistration[];
  }

  async findTicketByCode(ticketCode: string): Promise<EventRegistration> {
    const ticket = await this.prisma.eventRegistration.findUnique({
      where: { ticketCode },
      include: {
        event: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            memberCode: true,
            rtRw: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new AppError(
        `Kredensial tiket dengan kode "${ticketCode}" tidak ditemukan`,
        404,
      );
    }

    return this.enrichTicketCredential(ticket) as unknown as EventRegistration;
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

    if (ticket.status === "CANCELLED" || ticket.paymentStatus === "FAILED") {
      throw new AppError(
        "Tiket ini telah dibatalkan atau bukti pembayarannya ditolak",
        400,
      );
    }

    // Kegiatan berbayar: E-Tiket hanya sah setelah tiket masuk lunas diverifikasi.
    const requiresPayment =
      ticket.event.feeType === "PAID" && Number(ticket.event.ticketPrice) > 0;
    if (requiresPayment && ticket.paymentStatus !== "VERIFIED") {
      throw new AppError(
        "Tiket belum lunas. Verifikasi Pembayaran Tiket Masuk terlebih dahulu sebelum melakukan check-in.",
        400,
      );
    }

    if (ticket.status === "CHECKED_IN") {
      throw new AppError("Peserta ini sudah melakukan check-in sebelumnya", 400);
    }

    const updated = await this.prisma.eventRegistration.update({
      where: { id: ticket.id },
      data: {
        status: "CHECKED_IN",
        checkedInAt: new Date(),
        checkedInBy,
      },
      include: {
        event: true,
        user: {
          select: {
            id: true,
            memberCode: true,
            name: true,
            email: true,
            rtRw: true,
          },
        },
      },
    });

    return this.enrichTicketCredential(updated) as unknown as EventRegistration;
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

      const timeline = this.evaluateEventTimelineWib(event);

      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        category: event.category,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        registrationCloseAt: toWibIsoString(timeline.registrationCloseAt),
        closeRule: timeline.closeRule,
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
          checkedInAtWib: reg.checkedInAt
            ? formatDateTimeWib(reg.checkedInAt)
            : null,
          paymentProofUrl: reg.paymentProofUrl,
          paymentStatus: reg.paymentStatus,
          paymentNote: reg.paymentNote,
          verifiedAt: reg.verifiedAt,
          registeredAt: reg.createdAt,
          registeredAtWib: formatDateTimeWib(reg.createdAt),
        })),
      };
    });

    const overallRate =
      totalRegisteredAll > 0
        ? Math.round((totalAttendedAll / totalRegisteredAll) * 100)
        : 0;

    return {
      timezone: WIB_TIMEZONE,
      period: {
        from: from ? toWibIsoString(from) : null,
        to: to ? toWibIsoString(to) : null,
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
          event: true,
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

    return {
      data: data.map((r) => this.enrichTicketCredential(r)),
      total,
    };
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

    const updated = await this.prisma.$transaction(async (tx) => {
      // Jika ditolak (FAILED), kembalikan kuota event dan batalkan tiket
      if (status === "FAILED" && reg.status !== "CANCELLED") {
        await tx.communityEvent.update({
          where: { id: reg.eventId },
          data: { registeredCount: { decrement: 1 } },
        });
      }

      const result = await tx.eventRegistration.update({
        where: { id: registrationId },
        data: {
          paymentStatus: status,
          paymentNote: paymentNote ?? null,
          verifiedById: verifiedById ?? null,
          verifiedAt: new Date(),
          status: status === "FAILED" ? "CANCELLED" : reg.status,
        },
        include: {
          event: true,
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

      return result;
    });

    return this.enrichTicketCredential(updated);
  }

  /**
   * Evaluasi Status & Timeline Otomatis (Aturan Penutupan H-3 dalam WIB) untuk Semua Event
   */
  async getAutoCloseEvaluations() {
    const events = await this.prisma.communityEvent.findMany({
      orderBy: { eventDate: "asc" },
    });

    const now = new Date();

    return events.map((event) => {
      const timeline = this.evaluateEventTimelineWib(event, now);
      const daysUntilEvent = Math.ceil(
        (timeline.startsAt.getTime() - now.getTime()) / DAY_IN_MS,
      );

      return {
        id: event.id,
        title: event.title,
        slug: event.slug,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        feeType: event.feeType,
        ticketPrice: Number(event.ticketPrice),
        closeOffsetDays: timeline.closeOffsetDays,
        registrationCloseAt: toWibIsoString(timeline.registrationCloseAt),
        registrationCloseAtWib: formatDateTimeWib(timeline.registrationCloseAt),
        closeRule: timeline.closeRule,
        timezone: timeline.timezone,
        daysUntilEvent,
        quota: event.quota,
        registeredCount: event.registeredCount,
        seatsLeft: timeline.seatsLeft,
        isQuotaFull: timeline.isQuotaFull,
        isRegistrationCutoffPassed: timeline.isRegistrationCutoffPassed,
        isAutoClosed: timeline.isAutoClosed,
        isRegistrationOpen: timeline.isRegistrationOpen,
        phase: timeline.phase,
        label: timeline.label,
        closedReason: timeline.closedReason,
      };
    });
  }
}
