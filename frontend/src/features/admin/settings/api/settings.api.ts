import { get, patch } from '@/shared/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';
import type { SiteSetting, SiteSettingFormValues } from '../types/settings.types';

export function getSiteSetting() {
  return get<ApiEnvelope<SiteSetting>>('/settings');
}

export function updateSiteSetting(values: SiteSettingFormValues) {
  return patch<ApiEnvelope<SiteSetting>>('/settings', {
    siteName: values.siteName,
    tagline: values.tagline,
    address: values.address,
    phone: values.phone,
    email: values.email,
    mapsUrl: values.mapsUrl,
    instagramUrl: values.instagramUrl,
    openDays: values.openDays,
    openHours: values.openHours,
    donationInstructions: values.donationInstructions,
  });
}
