/** Profil komunitas yang ditampilkan di landing page & portal. */
export interface SiteSetting {
  id: string;
  siteName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  mapsUrl: string | null;
  instagramUrl: string | null;
  openDays: string;
  openHours: string;
  donationInstructions: string | null;
  updatedAt: string;
}

export interface SiteSettingFormValues {
  siteName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  mapsUrl: string;
  instagramUrl: string;
  openDays: string;
  openHours: string;
  donationInstructions: string;
}

export type SiteSettingField = keyof SiteSettingFormValues;
