export type PoiType = 'church';

export type Poi = {
  id: string;
  name: string;
  type: PoiType;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  qrCodeToken: string;
  // The order this place wants its modules in the bottom menu, set in the
  // admin dashboard. Modules it leaves out fall in behind the ones it
  // listed, in the app's own default order.
  menuOrder: ModuleType[];
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

// The sections a POI stacks on its home page, in the order it chose. The
// written ones (text, image) carry their own content; the rest pull live
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
  // Relative path (e.g. /uploads/poi-pages/<file>.jpg) — prefix with
  // API_BASE_URL (see api/client.ts) to get a loadable URL.
  imageUrl: string | null;
  // How many entries a live block shows.
  itemCount: number;
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

export type Event = {
  id: string;
  title: string;
  startsAt: string;
  location: string | null;
  description: string | null;
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
