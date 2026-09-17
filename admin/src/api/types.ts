export type PoiType = 'church';

export type SupportedLanguage = 'en' | 'es' | 'fr';

export type Poi = {
  id: string;
  name: string;
  type: PoiType;
  language: SupportedLanguage;
  description: string | null;
  pictureUrl: string | null;
  qrFlyerHeadline: string | null;
  qrFlyerSubtext: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  qrCodeToken: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  language: SupportedLanguage;
  adminPois: Poi[];
};

export type ModuleType =
  | 'donations'
  | 'events'
  | 'announcements'
  | 'prayer_requests'
  | 'livestreams'
  | 'community';

export type ModuleStatus = 'trial' | 'active' | 'expired' | 'cancelled';

export type ActiveModule = {
  id: string;
  moduleType: ModuleType;
  status: ModuleStatus;
  startDate: string;
  expirationDate: string | null;
};

export type Announcement = {
  id: string;
  title: string;
  body: string | null;
  audioUrl: string | null;
  createdAt: string;
};

export type Event = {
  id: string;
  title: string;
  startsAt: string;
  location: string | null;
  description: string | null;
};

export type LivestreamStatus = 'upcoming' | 'live' | 'ended';

export type Livestream = {
  id: string;
  title: string;
  url: string;
  scheduledAt: string;
  status: LivestreamStatus;
};

export type PrayerRequest = {
  id: string;
  authorName: string | null;
  message: string;
  prayerCount: number;
  createdAt: string;
};

export type CommunityPost = {
  id: string;
  authorName: string | null;
  message: string;
  createdAt: string;
  commentCount: number;
};

export type CommunityComment = {
  id: string;
  authorName: string | null;
  message: string;
  createdAt: string;
};

export type Donation = {
  id: string;
  amount: number;
  donorName: string | null;
  createdAt: string;
};

export type PeriodTotal = {
  total: number;
  count: number;
};

export type DailyTotal = {
  date: string;
  total: number;
  count: number;
};

export type DonationStats = {
  dailyTotals: DailyTotal[];
  thisWeek: PeriodTotal;
  lastWeek: PeriodTotal;
  thisMonth: PeriodTotal;
  lastMonth: PeriodTotal;
};
