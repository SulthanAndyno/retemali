import { PrismaClient } from "../../../generated/prisma";
import { UpdateSiteSettingInput } from "./settings.validation";

const SITE_SETTING_ID = "default";

const DEFAULT_SITE_SETTING = {
  id: SITE_SETTING_ID,
  siteName: "Taman Baca Rete Mali",
  tagline: "Ruang belajar & literasi warga",
  address: "RT 05 RW 14 Kelurahan Jatirangga",
  phone: "+62 812-0000-0000",
  email: "halo@retemali.id",
  openDays: "Selasa - Minggu",
  openHours: "09:00 - 18:00 WIB",
  donationInstructions:
    "Transfer ke rekening resmi Rete Mali, lalu unggah bukti pembayaran pada halaman donasi.",
};

export class SettingsRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Baris tunggal pengaturan situs. Upsert dipakai agar instalasi baru tetap
   * punya data default tanpa perlu seeding manual.
   */
  async getSiteSetting() {
    return this.prisma.siteSetting.upsert({
      where: { id: SITE_SETTING_ID },
      update: {},
      create: DEFAULT_SITE_SETTING,
    });
  }

  async updateSiteSetting(input: UpdateSiteSettingInput) {
    const data = {
      ...input,
      // URL kosong dari form disimpan sebagai NULL agar tidak muncul link mati.
      mapsUrl: input.mapsUrl === undefined ? undefined : input.mapsUrl || null,
      instagramUrl:
        input.instagramUrl === undefined ? undefined : input.instagramUrl || null,
    };

    return this.prisma.siteSetting.upsert({
      where: { id: SITE_SETTING_ID },
      update: data,
      create: { ...DEFAULT_SITE_SETTING, ...data },
    });
  }
}
