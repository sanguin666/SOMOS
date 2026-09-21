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
  // The order this parish wants its modules in the app's bottom menu.
  // The app gives the first few a button and puts the rest under More;
  // modules left out fall in behind in the app's default order.
  menuOrder: ModuleType[];
};

// The sections a POI stacks on its home page in the app, in the order it
// chose. `text` and `image` carry their own content; the rest pull live
// content from a module and render nothing when it isn't active.
export type PageBlockType =
  | 'text'
  | 'image'
  | 'next_events'
  | 'past_events'
  | 'latest_announcements'
  | 'next_livestream'
  | 'donate';

export type PoiPageBlock = {
  id: string;
  type: PageBlockType;
  position: number;
  title: string | null;
  body: string | null;
  // Relative path (e.g. /uploads/poi-pages/<file>.jpg) — prefix with the
  // API base URL to display it.
  imageUrl: string | null;
  itemCount: number;
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
