import { PrismaClient, Role, User, UserStatus } from "../../../generated/prisma";
import { getWibYear } from "../../utils/date-wib";
import {
  RegisterInput,
  UpdateProfileInput,
  UpdateUserStatusInput,
} from "./auth.validation";

export class AuthRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Membuat kode anggota unik (Kartu Anggota Digital).
   * Format: RM-{YEAR}-{4 digit urut}, contoh: RM-2026-0089
   */
  private async generateMemberCode(): Promise<string> {
    const year = getWibYear();
    const count = await this.prisma.user.count();
    for (let offset = 1; offset <= 50; offset += 1) {
      const sequence = String(count + offset).padStart(4, "0");
      const candidate = `RM-${year}-${sequence}`;
      const exists = await this.prisma.user.findUnique({
        where: { memberCode: candidate },
        select: { id: true },
      });
      if (!exists) return candidate;
    }
    const random = Math.floor(1000 + Math.random() * 9000);
    return `RM-${year}-${random}`;
  }

  /**
   * Mencari user berdasarkan email.
   *
   * @param email - Alamat email user
   * @returns User yang ditemukan atau null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Mencari user berdasarkan ID.
   *
   * @param id - ID user (cuid)
   * @returns User yang ditemukan atau null
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Mengecek apakah email sudah digunakan oleh user lain.
   *
   * @param email - Email yang ingin dicek
   * @param excludeId - ID user yang dikecualikan
   * @returns User yang memiliki email tersebut atau null
   */
  async findByEmailExcludeId(
    email: string,
    excludeId: string,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        NOT: { id: excludeId },
      },
    });
  }

  /**
   * Membuat user / anggota perpustakaan baru.
   *
   * @param data - Data registrasi
   * @param hashedPassword - Password yang sudah di-hash
   * @returns User yang baru dibuat
   */
  async createMember(
    data: RegisterInput,
    hashedPassword: string,
  ): Promise<User> {
    const memberCode = await this.generateMemberCode();

    return this.prisma.user.create({
      data: {
        memberCode,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone ?? null,
        rtRw: data.rtRw ?? "RT05/RW14",
      },
    });
  }

  /**
   * Mengupdate profil user.
   *
   * @param id - ID user
   * @param data - Data profil yang diupdate
   * @param avatarPath - Path foto profil baru (opsional)
   * @returns User yang telah diupdate
   */
  async updateProfile(
    id: string,
    data: UpdateProfileInput,
    avatarPath?: string,
  ): Promise<User> {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.rtRw !== undefined) updateData.rtRw = data.rtRw;
    if (data.readingTarget !== undefined)
      updateData.readingTarget = data.readingTarget;
    if (avatarPath !== undefined) updateData.avatar = avatarPath;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Mengupdate password user.
   *
   * @param id - ID user
   * @param hashedPassword - Password baru yang sudah di-hash
   * @returns User yang telah diupdate
   */
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async findAllUsers(options: {
    skip: number;
    take: number;
    search?: string;
    status?: UserStatus;
    role?: Role;
  }): Promise<{
    data: User[];
    total: number;
    counts: { active: number; pending: number; suspended: number };
  }> {
    const { skip, take, search, status, role } = options;
    const where: Record<string, unknown> = {
      ...(status && { status }),
      ...(role && { role }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { memberCode: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total, active, pending, suspended] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
      this.prisma.user.count({ where: { status: "ACTIVE" } }),
      this.prisma.user.count({ where: { status: "PENDING" } }),
      this.prisma.user.count({ where: { status: "SUSPENDED" } }),
    ]);

    return {
      data,
      total,
      counts: { active, pending, suspended },
    };
  }

  async updateUserStatusByAdmin(
    id: string,
    input: UpdateUserStatusInput,
    adminId?: string,
  ): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id },
        data: {
          ...(input.status && { status: input.status }),
          ...(input.role && { role: input.role }),
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: adminId ?? null,
          title: "Pembaruan Status/Peran Anggota",
          description: `Akun ${updated.name} (${updated.memberCode}) diperbarui menjadi status=${updated.status}, role=${updated.role}.`,
          category: "ACCESS_CONTROL",
        },
      });

      return updated;
    });
  }

  async updateUserCredentialsByAdmin(
    id: string,
    data: { email?: string; hashedPassword?: string },
    adminId?: string,
  ): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      const updateData: Record<string, unknown> = {};
      if (data.email !== undefined) updateData.email = data.email;
      if (data.hashedPassword !== undefined) {
        updateData.password = data.hashedPassword;
      }

      const updated = await tx.user.update({
        where: { id },
        data: updateData,
      });

      const changedFields: string[] = [];
      if (data.email !== undefined) changedFields.push(`email (${updated.email})`);
      if (data.hashedPassword !== undefined) changedFields.push("kata sandi sementara");

      await tx.auditLog.create({
        data: {
          actorId: adminId ?? null,
          title: "Reset Kredensial Anggota",
          description: `Admin memperbarui ${changedFields.join(" dan ")} untuk akun ${updated.name} (${updated.memberCode}).`,
          category: "ACCESS_CONTROL",
        },
      });

      return updated;
    });
  }
}
