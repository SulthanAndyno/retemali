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

async function main() {
  console.log("Seeding Taman Baca Rete Mali database (Admins & SiteSetting)...");

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
      select: { id: true, email: true, memberCode: true },
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
