import { env } from '../config';

type GooglePrediction = {
  description: string;
  place_id: string;
};

type GoogleAutocompleteResponse = {
  predictions?: GooglePrediction[];
  status?: string;
  error_message?: string;
};

type GooglePlaceDetailsResponse = {
  result?: {
    formatted_address?: string;
    geometry?: { location?: { lat: number; lng: number } };
  };
  status?: string;
};

type GoogleGeocodeResponse = {
  results?: Array<{
    formatted_address?: string;
    geometry?: { location?: { lat: number; lng: number } };
  }>;
  status?: string;
};

type GoogleDirectionsResponse = {
  routes?: Array<{
    legs?: Array<{
      distance?: { text?: string; value?: number };
      duration?: { text?: string; value?: number };
    }>;
  }>;
  status?: string;
};

const fortalezaBias = '-3.7319,-38.5267';

export async function getAddressSuggestions(input: string) {
  if (!env.GOOGLE_MAPS_API_KEY) {
    return { available: false, suggestions: [] };
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
  url.searchParams.set('input', input);
  url.searchParams.set('language', 'pt-BR');
  url.searchParams.set('components', 'country:br');
  url.searchParams.set('location', fortalezaBias);
  url.searchParams.set('radius', '70000');
  url.searchParams.set('key', env.GOOGLE_MAPS_API_KEY);

  const response = await fetch(url);
  const data = (await response.json()) as GoogleAutocompleteResponse;

  if (!response.ok || data.status === 'REQUEST_DENIED') {
    return { available: false, suggestions: [] };
  }

  return {
    available: true,
    suggestions:
      data.predictions?.map((item) => ({
        label: item.description,
        placeId: item.place_id
      })) ?? []
  };
}

export async function getPlaceDetails(placeId: string) {
  if (!env.GOOGLE_MAPS_API_KEY) {
    return { available: false, place: null };
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'formatted_address,geometry');
  url.searchParams.set('language', 'pt-BR');
  url.searchParams.set('key', env.GOOGLE_MAPS_API_KEY);

  const response = await fetch(url);
  const data = (await response.json()) as GooglePlaceDetailsResponse;
  const location = data.result?.geometry?.location;

  if (!response.ok || !location) {
    return { available: false, place: null };
  }

  return {
    available: true,
    place: {
      address: data.result?.formatted_address ?? '',
      latitude: location.lat,
      longitude: location.lng
    }
  };
}

export async function reverseGeocode(latitude: number, longitude: number) {
  if (!env.GOOGLE_MAPS_API_KEY) {
    return { available: false, address: null };
  }

  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
  url.searchParams.set('latlng', `${latitude},${longitude}`);
  url.searchParams.set('language', 'pt-BR');
  url.searchParams.set('key', env.GOOGLE_MAPS_API_KEY);

  const response = await fetch(url);
  const data = (await response.json()) as GoogleGeocodeResponse;
  const firstResult = data.results?.[0];

  if (!response.ok || !firstResult?.formatted_address) {
    return { available: false, address: null };
  }

  return {
    available: true,
    address: firstResult.formatted_address
  };
}

export async function getRouteEstimate(params: {
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
}) {
  if (!env.GOOGLE_MAPS_API_KEY) {
    return { available: false, distance: null, duration: null };
  }

  const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
  url.searchParams.set('origin', `${params.originLatitude},${params.originLongitude}`);
  url.searchParams.set('destination', `${params.destinationLatitude},${params.destinationLongitude}`);
  url.searchParams.set('language', 'pt-BR');
  url.searchParams.set('mode', 'driving');
  url.searchParams.set('key', env.GOOGLE_MAPS_API_KEY);

  const response = await fetch(url);
  const data = (await response.json()) as GoogleDirectionsResponse;
  const leg = data.routes?.[0]?.legs?.[0];

  if (!response.ok || !leg) {
    return { available: false, distance: null, duration: null };
  }

  return {
    available: true,
    distance: leg.distance?.text ?? null,
    duration: leg.duration?.text ?? null
  };
}
