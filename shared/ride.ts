import { z } from 'zod';

export const rideStatuses = [
  'NEW',
  'WAITING',
  'CONTACTED',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED'
] as const;

export const rideTypes = [
  'Corrida particular',
  'Aeroporto',
  'Show',
  'Evento',
  'Passeio',
  'Viagem',
  'Viagem executiva',
  'Empresarial',
  'Outro'
] as const;

const optionalLatitude = z
  .number()
  .finite()
  .min(-90, 'Latitude invalida')
  .max(90, 'Latitude invalida')
  .optional()
  .nullable();

const optionalLongitude = z
  .number()
  .finite()
  .min(-180, 'Longitude invalida')
  .max(180, 'Longitude invalida')
  .optional()
  .nullable();

export const rideRequestInputSchema = z.object({
  customerName: z.string().trim().min(2, 'Informe seu nome').max(120),
  customerPhone: z.string().trim().max(30).optional().nullable(),
  origin: z.string().trim().min(3, 'Informe o local de partida').max(240),
  originLatitude: optionalLatitude,
  originLongitude: optionalLongitude,
  destination: z.string().trim().min(3, 'Informe o destino').max(240),
  destinationLatitude: optionalLatitude,
  destinationLongitude: optionalLongitude,
  rideDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data invalida'),
  rideTime: z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário inválido'),
  passengers: z.number().int().min(1).max(4),
  luggage: z.enum(['Nenhuma', '1', '2', '3', '4', 'Mais de 4']),
  rideType: z.enum(rideTypes),
  notes: z.string().trim().max(600).optional().nullable(),
  estimatedDistance: z.string().trim().max(80).optional().nullable(),
  estimatedDuration: z.string().trim().max(80).optional().nullable(),
  estimatedPrice: z.string().trim().max(80).optional().nullable()
});

export const rideRequestServerSchema = rideRequestInputSchema.superRefine((data, ctx) => {
  const requestedDate = new Date(`${data.rideDate}T${data.rideTime}:00`);
  if (Number.isNaN(requestedDate.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['rideDate'],
      message: 'Data e horario invalidos'
    });
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const requestedDay = new Date(`${data.rideDate}T00:00:00`);
  if (requestedDay < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['rideDate'],
      message: 'A data nao pode estar no passado'
    });
  }
});

export const rideRequestPatchSchema = z.object({
  status: z.enum(rideStatuses).optional(),
  whatsappOpened: z.literal(true).optional()
});

export type RideRequestInput = z.infer<typeof rideRequestInputSchema>;
export type RideRequestStatus = (typeof rideStatuses)[number];
export type RideType = (typeof rideTypes)[number];
