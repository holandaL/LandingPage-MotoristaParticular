import { describe, expect, it } from 'vitest';
import { rideRequestInputSchema } from './ride';

const basePayload = {
  customerName: 'Thiago',
  customerPhone: '85999999999',
  origin: 'Aldeota, Fortaleza',
  destination: 'Aeroporto Internacional de Fortaleza',
  rideDate: '2027-08-15',
  rideTime: '05:30',
  passengers: 2,
  luggage: '2',
  rideType: 'Aeroporto',
  notes: 'Duas malas grandes.',
  estimatedDistance: '12,7 km',
  estimatedDuration: '27 min',
  estimatedPrice: 'Valor a confirmar com Sampaio'
} as const;

describe('ride request validation', () => {
  it('accepts a valid ride request', () => {
    expect(rideRequestInputSchema.safeParse(basePayload).success).toBe(true);
  });

  it('rejects more than four passengers', () => {
    expect(rideRequestInputSchema.safeParse({ ...basePayload, passengers: 5 }).success).toBe(false);
  });

  it('rejects invalid time values', () => {
    expect(rideRequestInputSchema.safeParse({ ...basePayload, rideTime: '25:10' }).success).toBe(false);
  });

  it('accepts special characters in human-entered fields', () => {
    const parsed = rideRequestInputSchema.safeParse({
      ...basePayload,
      customerName: 'José Átila',
      origin: 'Av. Desembargador Moreira, nº 1000',
      notes: 'Criança com cadeirinha própria.'
    });
    expect(parsed.success).toBe(true);
  });
});
