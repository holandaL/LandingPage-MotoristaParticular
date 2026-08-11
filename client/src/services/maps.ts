import type { AddressSuggestion } from '@/types/ride';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

type AutocompleteResponse = {
  available: boolean;
  suggestions: AddressSuggestion[];
};

type PlaceResponse = {
  available: boolean;
  place: null | {
    address: string;
    latitude: number;
    longitude: number;
  };
};

type ReverseResponse = {
  available: boolean;
  address: string | null;
};

type RouteResponse = {
  available: boolean;
  distance: string | null;
  duration: string | null;
};

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`);
  if (!response.ok) {
    throw new Error('Serviço de mapas indisponível.');
  }
  return response.json() as Promise<T>;
}

export function autocompleteAddress(input: string) {
  return getJson<AutocompleteResponse>(`/api/maps/autocomplete?input=${encodeURIComponent(input)}`);
}

export function getPlace(placeId: string) {
  return getJson<PlaceResponse>(`/api/maps/places/${encodeURIComponent(placeId)}`);
}

export function reverseGeocode(latitude: number, longitude: number) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude)
  });
  return getJson<ReverseResponse>(`/api/maps/reverse-geocode?${params.toString()}`);
}

export function routeEstimate(params: {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
}) {
  const query = new URLSearchParams({
    originLatitude: String(params.originLatitude),
    originLongitude: String(params.originLongitude),
    destinationLatitude: String(params.destinationLatitude),
    destinationLongitude: String(params.destinationLongitude)
  });
  return getJson<RouteResponse>(`/api/maps/route?${query.toString()}`);
}
