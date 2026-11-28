import "dotenv/config";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { BookCategory } from "../generated/prisma";
import { prisma } from "../src/lib/prisma";

const SALT_ROUNDS = 12;

interface CatalogBookEntry {
  bookCode: string;
  isbn: string | null;
  title: string;
  slug: string;
  author: string;
  publisher: string | null;
  publishYear: number | null;
  category: BookCategory;
  ageGroup: string | null;
  synopsis: string | null;
  shelfLocation: string;
  totalStock: number;
  availableStock: number;
}

async function seedCatalogIfEmpty(): Promise<number> {
  const existingCount = await prisma.book.count();
  if (existingCount > 0) {
    console.log(`Book catalog already populated (${existingCount} books), skipping catalog seed.`);
    return 0;
  }

  const catalogPath = path.join(__dirname, "books-catalog.json");
  if (!fs.existsSync(catalogPath)) {
    console.log("No prisma/books-catalog.json found, skipping catalog seed.");
    return 0;
  }

  const raw = fs.readFileSync(catalogPath, "utf8");
  const books = JSON.parse(raw) as CatalogBookEntry[];
  if (books.length === 0) return 0;

  const result = await prisma.book.createMany({
    data: books.map((b) => ({
      bookCode: b.bookCode,
      isbn: b.isbn,
      title: b.title,
      slug: b.slug,
      author: b.author,
      publisher: b.publisher,
      publishYear: b.publishYear,
      category: b.category,
      ageGroup: b.ageGroup ?? null,
      synopsis: b.synopsis,
      shelfLocation: b.shelfLocation,
      totalStock: b.totalStock,
      availableStock: b.availableStock,
      status: "AVAILABLE",
    })),
    skipDuplicates: true,
  });

  console.log(`Seeded Book Catalog: ${result.count} books inserted.`);
  return result.count;
}

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
    preferredMemberCode: "RM-2026-0006",
    name: "Annis",
    email: "anniskarulika@gmail.com",
    initialPassword: "ReteMali#Annis06",
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
    await seedCatalogIfEmpty();
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
  await seedCatalogIfEmpty();
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
