import { Router } from 'express';
import { z } from 'zod';
import { getAddressSuggestions, getPlaceDetails, getRouteEstimate, reverseGeocode } from '../services/maps';

export const mapsRouter = Router();

mapsRouter.get('/autocomplete', async (req, res, next) => {
  try {
    const { input } = z.object({ input: z.string().trim().min(3).max(160) }).parse(req.query);
    res.json(await getAddressSuggestions(input));
  } catch (error) {
    next(error);
  }
});

mapsRouter.get('/places/:placeId', async (req, res, next) => {
  try {
    const { placeId } = z.object({ placeId: z.string().trim().min(4).max(220) }).parse(req.params);
    res.json(await getPlaceDetails(placeId));
  } catch (error) {
    next(error);
  }
});

mapsRouter.get('/reverse-geocode', async (req, res, next) => {
  try {
    const params = z
      .object({
        latitude: z.coerce.number().finite().min(-90).max(90),
        longitude: z.coerce.number().finite().min(-180).max(180)
      })
      .parse(req.query);
    res.json(await reverseGeocode(params.latitude, params.longitude));
  } catch (error) {
    next(error);
  }
});

mapsRouter.get('/route', async (req, res, next) => {
  try {
    const params = z
      .object({
        originLatitude: z.coerce.number().finite().min(-90).max(90),
        originLongitude: z.coerce.number().finite().min(-180).max(180),
        destinationLatitude: z.coerce.number().finite().min(-90).max(90),
        destinationLongitude: z.coerce.number().finite().min(-180).max(180)
      })
      .parse(req.query);
    res.json(await getRouteEstimate(params));
  } catch (error) {
    next(error);
  }
});
