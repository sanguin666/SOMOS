export type PoiType = 'church';

export type Poi = {
  id: string;
  name: string;
  type: PoiType;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  qrCodeToken: string;
  createdAt: string;
  updatedAt: string;
};

export type ModuleType =
  | 'donations'
  | 'events'
  | 'announcements'
  | 'prayer_requests'
  | 'livestreams'
  | 'community';

export type ActiveModule = {
  id: string;
  moduleType: ModuleType;
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  startDate: string;
  expirationDate: string | null;
};

export type Announcement = {
  id: string;
  title: string;
  body: string | null;
  // Relative path (e.g. /uploads/announcements/<file>.m4a) — prefix with
  // API_BASE_URL (see api/client.ts) to get a playable URL.
  audioUrl: string | null;
  createdAt: string;
};

export type PrayerRequest = {
  id: string;
  authorName: string | null;
  message: string;
  prayerCount: number;
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
