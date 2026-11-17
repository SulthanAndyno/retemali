import type { Book, BookCategory } from './book.types';

export interface CommunityInfo {
  name: string;
  area: string;
  openDays: string;
  openHours: string;
}

export interface PublicMetrics {
  totalTitles: number;
  totalUnits: number;
  readyToBorrowUnits: number;
  currentlyBorrowedUnits: number;
  activeMembers: number;
}

export interface FeaturedEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  facilitatorName: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  quota: number;
  registeredCount: number;
  feeType: 'FREE' | 'INFAQ';
  infaqAmount: string | number;
  bannerImage?: string | null;
  isFeatured: boolean;
  status: string;
}

export interface ActiveCampaign {
  id: string;
  title: string;
  targetAmount: string | number;
  collectedAmount: string | number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicHome {
  communityInfo: CommunityInfo;
  metrics: PublicMetrics;
  popularBooks: Book[];
  featuredEvents: FeaturedEvent[];
  activeCampaign: ActiveCampaign | null;
}

export type HomeCategoryValue = 'ALL' | BookCategory;

export interface HomeCategoryOption {
  value: HomeCategoryValue;
  label: string;
}
