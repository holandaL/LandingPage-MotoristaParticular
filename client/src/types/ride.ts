import type { RideRequestInput, RideRequestStatus } from '@shared/ride';

export type RideRequest = RideRequestInput & {
  publicId: string;
  status: RideRequestStatus;
  whatsappOpened: boolean;
  whatsappOpenedAt?: string | null;
  createdAt: string;
};

export type AddressSuggestion = {
  label: string;
  placeId: string;
};

export type AddressValue = {
  address: string;
  latitude?: number | null;
  longitude?: number | null;
};
