import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

const SALT_ROUNDS = 12;

interface AdminSeedEntry {
  preferredMemberCode: string;
  name: string;
  email: string;
  initialPassword: string;
}

const DEMO_SEED_EMAILS: readonly string[] = [
  "admin@retemali.id",
  "relawan@retemali.id",
  "rifky@retemali.id",
];

const ADMIN_ACCOUNTS: readonly AdminSeedEntry[] = [
  {
    preferredMemberCode: "RM-2026-0001",
    name: "Tanti (Ketua)",
    email: "retemali.tanti@gmail.com",
    initialPassword: "ReteMali#Tanti01",
  },
  {
    preferredMemberCode: "RM-2026-0002",
    name: "Umi Naffisah (Wakil Ketua)",
    email: "umi.naffisah13@gmail.com",
    initialPassword: "ReteMali#Umi13",
  },
  {
    preferredMemberCode: "RM-2026-0003",
    name: "Aninda Zulfa (Sekretaris)",
    email: "aninda.zulfa89@gmail.com",
    initialPassword: "ReteMali#Aninda89",
  },
  {
    preferredMemberCode: "RM-2026-0004",
    name: "Laras",
    email: "yhayaz_annisa@yahoo.com",
    initialPassword: "ReteMali#Laras04",
  },
  {
    preferredMemberCode: "RM-2026-0005",
    name: "Nania",
    email: "virginaniac@gmail.com",
    initialPassword: "ReteMali#Nania05",
  },
  {
    preferredMemberCode: "RM-ADMIN-006",
    name: "Annis",
    email: "anniskarulika@gmail.com",
    initialPassword: "ReteMali#Annis06",
  },
  {
    preferredMemberCode: "RM-ADMIN-007",
    name: "Koordinator Rete Mali",
    email: "admin@retemali.id",
    initialPassword: "ReteMali#Admin123",
  },
];

async function resolveAvailableMemberCode(preferred: string): Promise<string> {
  const taken = await prisma.user.findUnique({
    where: { memberCode: preferred },
    select: { id: true },
  });
  if (!taken) return preferred;

  const year = new Date().getFullYear();
  const prefix = `RM-${year}-`;
  const existing = await prisma.user.findMany({
    where: { memberCode: { startsWith: prefix } },
    select: { memberCode: true },
  });

  let maxSeq = 0;
  for (const row of existing) {
    const seq = Number.parseInt(row.memberCode.slice(prefix.length), 10);
    if (Number.isFinite(seq) && seq > maxSeq) {
      maxSeq = seq;
    }
  }
  return `${prefix}${String(maxSeq + 1).padStart(4, "0")}`;
}

async function flushAndSeedFresh(): Promise<string[]> {
  const tablesResult = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '_prisma_migrations'
    ORDER BY tablename ASC
  `;

  if (tablesResult.length === 0) {
    throw new Error("Tidak ada tabel aplikasi ditemukan pada schema public.");
  }

  const tableList = tablesResult.map((t) => `"${t.tablename}"`).join(", ");
  const truncateSql = `TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE`;

  const preparedAdmins = await Promise.all(
    ADMIN_ACCOUNTS.map(async (admin) => ({
      memberCode: admin.preferredMemberCode,
      name: admin.name,
      email: admin.email.toLowerCase(),
      passwordHash: await bcrypt.hash(admin.initialPassword, SALT_ROUNDS),
    })),
  );

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(truncateSql);

    await tx.siteSetting.create({
      data: {
        id: "default",
        donationInstructions:
          "Transfer ke rekening resmi Rete Mali, lalu unggah bukti pembayaran pada halaman donasi.",
      },
    });

    for (const admin of preparedAdmins) {
      await tx.user.create({
        data: {
          memberCode: admin.memberCode,
          name: admin.name,
          email: admin.email,
          password: admin.passwordHash,
          rtRw: "RT05/RW14",
          role: "ADMIN",
          status: "ACTIVE",
        },
      });
    }
  });

  return preparedAdmins.map((a) => `${a.email} (created: ${a.memberCode})`);
}

async function main() {
  console.log("Seeding Taman Baca Rete Mali database (Admins & SiteSetting)...");

  const forceFlush =
    process.env.FLUSH_DB === "true" || process.argv.includes("--flush");

  const realAdminEmails = ADMIN_ACCOUNTS.map((a) => a.email.toLowerCase());
  const [hasDemoUsers, hasAnyRealAdmin] = await Promise.all([
    prisma.user.count({ where: { email: { in: [...DEMO_SEED_EMAILS] } } }),
    prisma.user.count({ where: { email: { in: realAdminEmails } } }),
  ]);

  // Auto-flush once if database still only holds legacy demo accounts and none of the real admins exist,
  // or when explicitly requested via FLUSH_DB=true / --flush.
  if (forceFlush || (hasDemoUsers > 0 && hasAnyRealAdmin === 0)) {
    console.log(
      forceFlush
        ? "FLUSH_DB requested: truncating all application tables before seeding..."
        : "Legacy demo accounts detected without real admins: flushing demo data once before seeding...",
    );
    const seeded = await flushAndSeedFresh();
    console.log("Seeded Admin Accounts:", seeded);
    console.log("Seeding finished successfully.");
    return;
  }

  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      donationInstructions:
        "Transfer ke rekening resmi Rete Mali, lalu unggah bukti pembayaran pada halaman donasi.",
    },
  });

  const seededEmails: string[] = [];

  for (const admin of ADMIN_ACCOUNTS) {
    const email = admin.email.toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { email: true, memberCode: true },
    });

    if (existing) {
      seededEmails.push(`${existing.email} (existing: ${existing.memberCode})`);
      continue;
    }

    const memberCode = await resolveAvailableMemberCode(admin.preferredMemberCode);
    const passwordHash = await bcrypt.hash(admin.initialPassword, SALT_ROUNDS);

    const created = await prisma.user.create({
      data: {
        memberCode,
        name: admin.name,
        email,
        password: passwordHash,
        rtRw: "RT05/RW14",
        role: "ADMIN",
        status: "ACTIVE",
      },
      select: { email: true, memberCode: true },
    });
    seededEmails.push(`${created.email} (created: ${created.memberCode})`);
  }

  console.log("Seeded Admin Accounts:", seededEmails);
  console.log("Seeding finished successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
