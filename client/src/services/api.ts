import type { RideRequestInput } from '@shared/ride';
import type { RideRequest } from '@/types/ride';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function parseApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
        ? body.error
        : 'Não foi possível concluir a solicitação.';
    throw new Error(message);
  }

  return body as T;
}

export async function createRideRequest(payload: RideRequestInput) {
  const response = await fetch(`${API_BASE_URL}/api/ride-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return parseApiResponse<{ ride: RideRequest }>(response);
}

export async function markWhatsappOpened(publicId: string) {
  const response = await fetch(`${API_BASE_URL}/api/ride-requests/${encodeURIComponent(publicId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ whatsappOpened: true })
  });

  return parseApiResponse<{ ride: RideRequest }>(response);
}
