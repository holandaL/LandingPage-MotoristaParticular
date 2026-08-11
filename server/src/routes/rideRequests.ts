import { Prisma, type RideRequest } from '@prisma/client';
import { Router } from 'express';
import { rideRequestPatchSchema, rideRequestServerSchema } from '../../../shared/ride';
import { env } from '../config';
import { prisma } from '../db';
import { ApiError } from '../middleware/errors';
import { createPublicRideId } from '../services/publicId';

export const rideRequestsRouter = Router();

function sanitizeNullable(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}

async function createUniquePublicId() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const publicId = createPublicRideId();
    const existing = await prisma.rideRequest.findUnique({ where: { publicId } });
    if (!existing) {
      return publicId;
    }
  }
  throw new ApiError(500, 'Não foi possível gerar o código da solicitação.');
}

function toPublicRide(ride: RideRequest) {
  return {
    publicId: ride.publicId,
    customerName: ride.customerName,
    customerPhone: ride.customerPhone,
    origin: ride.origin,
    originLatitude: ride.originLatitude ? Number(ride.originLatitude) : null,
    originLongitude: ride.originLongitude ? Number(ride.originLongitude) : null,
    destination: ride.destination,
    destinationLatitude: ride.destinationLatitude ? Number(ride.destinationLatitude) : null,
    destinationLongitude: ride.destinationLongitude ? Number(ride.destinationLongitude) : null,
    rideDate: ride.rideDate.toISOString().slice(0, 10),
    rideTime: ride.rideTime,
    passengers: ride.passengers,
    luggage: ride.luggage,
    rideType: ride.rideType,
    notes: ride.notes,
    estimatedDistance: ride.estimatedDistance,
    estimatedDuration: ride.estimatedDuration,
    estimatedPrice: ride.estimatedPrice,
    status: ride.status,
    whatsappOpened: ride.whatsappOpened,
    whatsappOpenedAt: ride.whatsappOpenedAt,
    createdAt: ride.createdAt
  };
}

rideRequestsRouter.post('/', async (req, res, next) => {
  try {
    const input = rideRequestServerSchema.parse(req.body);
    const publicId = await createUniquePublicId();

    const ride = await prisma.rideRequest.create({
      data: {
        publicId,
        customerName: input.customerName.trim(),
        customerPhone: sanitizeNullable(input.customerPhone),
        origin: input.origin.trim(),
        originLatitude: input.originLatitude == null ? null : new Prisma.Decimal(input.originLatitude),
        originLongitude: input.originLongitude == null ? null : new Prisma.Decimal(input.originLongitude),
        destination: input.destination.trim(),
        destinationLatitude: input.destinationLatitude == null ? null : new Prisma.Decimal(input.destinationLatitude),
        destinationLongitude: input.destinationLongitude == null ? null : new Prisma.Decimal(input.destinationLongitude),
        rideDate: new Date(`${input.rideDate}T00:00:00`),
        rideTime: input.rideTime,
        passengers: input.passengers,
        luggage: input.luggage,
        rideType: input.rideType,
        notes: sanitizeNullable(input.notes),
        estimatedDistance: sanitizeNullable(input.estimatedDistance),
        estimatedDuration: sanitizeNullable(input.estimatedDuration),
        estimatedPrice: sanitizeNullable(input.estimatedPrice) ?? 'Valor a confirmar com Sampaio',
        status: 'NEW'
      }
    });

    res.status(201).json({ ride: toPublicRide(ride) });
  } catch (error) {
    next(error);
  }
});

rideRequestsRouter.get('/:publicId', async (req, res, next) => {
  try {
    const publicId = String(req.params.publicId).trim().toUpperCase();
    const ride = await prisma.rideRequest.findUnique({ where: { publicId } });

    if (!ride) {
      throw new ApiError(404, 'Solicitação não encontrada.');
    }

    res.json({ ride: toPublicRide(ride) });
  } catch (error) {
    next(error);
  }
});

rideRequestsRouter.patch('/:publicId', async (req, res, next) => {
  try {
    const publicId = String(req.params.publicId).trim().toUpperCase();
    const existing = await prisma.rideRequest.findUnique({ where: { publicId } });
    if (!existing) {
      throw new ApiError(404, 'Solicitação não encontrada.');
    }

    const input = rideRequestPatchSchema.parse(req.body);
    const updateData: Prisma.RideRequestUpdateInput = {};

    if (input.whatsappOpened) {
      updateData.whatsappOpened = true;
      updateData.whatsappOpenedAt = new Date();
    }

    if (input.status) {
      if (req.header('x-admin-token') !== env.ADMIN_TOKEN) {
        throw new ApiError(401, 'Atualização de status exige credencial administrativa.');
      }
      updateData.status = input.status;
    }

    if (!Object.keys(updateData).length) {
      throw new ApiError(400, 'Nenhuma atualizacao valida enviada');
    }

    const ride = await prisma.rideRequest.update({
      where: { publicId },
      data: updateData
    });

    res.json({ ride: toPublicRide(ride) });
  } catch (error) {
    next(error);
  }
});
