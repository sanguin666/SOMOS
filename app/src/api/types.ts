export type Poi = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  qrCodeToken: string;
  createdAt: string;
  updatedAt: string;
};

export type ModuleType = 'donations' | 'events';

export type ActiveModule = {
  id: string;
  moduleType: ModuleType;
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  startDate: string;
  expirationDate: string | null;
};
