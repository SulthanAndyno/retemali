import { AppError } from "@/middlewares/error.middleware";
import {
  PrismaClient,
  VolunteerApplication,
  VolunteerShift,
} from "../../../generated/prisma";
import {
  ApplyVolunteerInput,
  ClockInInput,
  ClockOutInput,
  ReviewApplicationInput,
} from "./volunteer.validation";

export class VolunteerRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Membuat berkas pendaftaran Calon Relawan Baru.
   */
  async createApplication(
    userId: string,
    data: ApplyVolunteerInput,
    cvPath?: string,
  ): Promise<VolunteerApplication> {
    const [existing, currentUser] = await Promise.all([
      this.prisma.volunteerApplication.findUnique({
        where: { userId },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      }),
    ]);

    if (existing) {
      const isStillActiveVolunteer =
        existing.status === "APPROVED" &&
        (currentUser?.role === "VOLUNTEER" || currentUser?.role === "ADMIN");

      if (existing.status === "PENDING" || isStillActiveVolunteer) {
        throw new AppError(
          "Anda sudah pernah mengajukan pendaftaran relawan",
          400,
        );
      }

      // Jika pernah ditolak (REJECTED) atau sudah diturunkan kembali menjadi MEMBER, izinkan daftar ulang
      return this.prisma.volunteerApplication.update({
        where: { userId },
        data: {
          majorOrJob: data.majorOrJob,
          institution: data.institution,
          division: data.division,
          motivation: data.motivation,
          ...(cvPath !== undefined ? { cvDocument: cvPath } : {}),
          status: "PENDING",
          reviewedById: null,
          reviewedAt: null,
          rejectionNote: null,
        },
        include: {
          user: {
            select: {
              id: true,
              memberCode: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
      });
    }

    return this.prisma.volunteerApplication.create({
      data: {
        userId,
        majorOrJob: data.majorOrJob,
        institution: data.institution,
        division: data.division,
        motivation: data.motivation,
        cvDocument: cvPath ?? null,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            memberCode: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
  }

  /**
   * Mengambil daftar berkas calon relawan baru.
   */
  async findAllApplications(options: {
    skip: number;
    take: number;
    status?: string;
  }): Promise<{ data: VolunteerApplication[]; total: number }> {
    const { skip, take, status } = options;
    const where: Record<string, unknown> = {
      ...(status && { status }),
    };

    const [data, total] = await Promise.all([
      this.prisma.volunteerApplication.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              memberCode: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.volunteerApplication.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Menyetujui atau menolak pendaftaran calon relawan baru oleh Admin.
   */
  async reviewApplication(
    id: string,
    adminId: string,
    data: ReviewApplicationInput,
  ): Promise<VolunteerApplication> {
    const application = await this.prisma.volunteerApplication.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!application) {
      throw new AppError("Berkas pendaftaran relawan tidak ditemukan", 404);
    }

    return this.prisma.$transaction(async (tx) => {
      if (data.status === "APPROVED") {
        await tx.user.update({
          where: { id: application.userId },
          data: { role: "VOLUNTEER" },
        });

        await tx.auditLog.create({
          data: {
            actorId: adminId,
            title: "Persetujuan Relawan Baru",
            description: `Akun ${application.user.name} disetujui menjadi Relawan divisi ${application.division}.`,
            category: "ACCESS_CONTROL",
          },
        });
      }

      return tx.volunteerApplication.update({
        where: { id },
        data: {
          status: data.status,
          reviewedById: adminId,
          reviewedAt: new Date(),
          rejectionNote: data.rejectionNote ?? null,
        },
        include: {
          user: {
            select: {
              id: true,
              memberCode: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });
    });
  }

  /**
   * Mengubah peran akun relawan menjadi anggota biasa (VOLUNTEER -> MEMBER).
   * Perubahan langsung menulis kolom `User.role` sehingga otorisasi berikutnya
   * (yang membaca peran dari database) langsung memakai peran baru.
   */
  async changeUserRole(
    targetUserId: string,
    newRole: "MEMBER",
    adminId: string,
  ) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        memberCode: true,
        role: true,
      },
    });

    if (!target) {
      throw new AppError("Akun relawan tidak ditemukan", 404);
    }

    if (target.role === "ADMIN") {
      throw new AppError(
        "Peran Admin tidak dapat diubah dari menu manajemen relawan",
        403,
      );
    }

    if (target.role === newRole) {
      return {
        user: target,
        previousRole: target.role,
        changed: false,
        note: `${target.name} sudah memiliki peran ${newRole}.`,
      };
    }

    const previousRole = target.role;

    const updated = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
        select: {
          id: true,
          name: true,
          email: true,
          memberCode: true,
          role: true,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: adminId,
          title: "Perubahan Peran Relawan menjadi Anggota",
          description: `${user.name} (${user.email}, ${user.memberCode}) diubah dari ${previousRole} menjadi ${newRole}. Akses portal relawan dicabut.`,
          category: "ACCESS_CONTROL",
        },
      });

      return user;
    });

    return {
      user: updated,
      previousRole,
      changed: true,
      note: `${updated.name} kini berperan ${newRole}; akses relawan langsung dicabut.`,
    };
  }

  /**
   * Memulai sesi piket relawan (Clock-In).
   */
  async clockIn(userId: string, data: ClockInInput): Promise<VolunteerShift> {
    const ongoing = await this.prisma.volunteerShift.findFirst({
      where: {
        userId,
        approvalStatus: "ONGOING",
      },
    });

    if (ongoing) {
      throw new AppError(
        "Anda masih memiliki sesi piket yang sedang berjalan (belum Clock-Out)",
        400,
      );
    }

    return this.prisma.volunteerShift.create({
      data: {
        userId,
        shiftType: data.shiftType,
        location: data.location,
        taskSummary: data.taskSummary ?? null,
        approvalStatus: "ONGOING",
      },
      include: {
        user: { select: { id: true, name: true, memberCode: true } },
      },
    });
  }

  /**
   * Mengakhiri sesi piket relawan (Clock-Out) dan menghitung jam kerja.
   */
  async clockOut(userId: string, data: ClockOutInput): Promise<VolunteerShift> {
    const ongoing = await this.prisma.volunteerShift.findFirst({
      where: {
        userId,
        approvalStatus: "ONGOING",
      },
      orderBy: { clockInAt: "desc" },
    });

    if (!ongoing) {
      throw new AppError(
        "Tidak ada sesi piket aktif yang sedang berjalan",
        404,
      );
    }

    const now = new Date();
    const diffHours =
      (now.getTime() - ongoing.clockInAt.getTime()) / (1000 * 60 * 60);
    const calculatedHours =
      data.durationHours ?? Math.max(0.5, Number(diffHours.toFixed(1)));

    return this.prisma.volunteerShift.update({
      where: { id: ongoing.id },
      data: {
        clockOutAt: now,
        taskSummary: data.taskSummary,
        durationHours: calculatedHours,
        approvalStatus: "PENDING_APPROVAL",
      },
      include: {
        user: { select: { id: true, name: true, memberCode: true } },
      },
    });
  }

  /**
   * Mengambil daftar shift & jam piket relawan.
   */
  async findAllShifts(options: {
    skip: number;
    take: number;
    status?: string;
  }): Promise<{ data: VolunteerShift[]; total: number }> {
    const { skip, take, status } = options;
    const where: Record<string, unknown> = {
      ...(status && { approvalStatus: status }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.volunteerShift.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              memberCode: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { clockInAt: "desc" },
      }),
      this.prisma.volunteerShift.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Menyetujui 1 sesi jam piket relawan oleh Admin.
   */
  async approveShift(id: string, adminId: string): Promise<VolunteerShift> {
    return this.prisma.volunteerShift.update({
      where: { id },
      data: {
        approvalStatus: "APPROVED",
        approvedById: adminId,
        approvedAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, memberCode: true } },
      },
    });
  }

  /**
   * Menyetujui semua antrean jam piket relawan (Setujui Semua).
   */
  async approveAllPendingShifts(adminId: string): Promise<{ count: number }> {
    return this.prisma.volunteerShift.updateMany({
      where: { approvalStatus: "PENDING_APPROVAL" },
      data: {
        approvalStatus: "APPROVED",
        approvedById: adminId,
        approvedAt: new Date(),
      },
    });
  }
}
