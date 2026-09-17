export type PoiType = 'church';

export type Poi = {
  id: string;
  name: string;
  type: PoiType;
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
