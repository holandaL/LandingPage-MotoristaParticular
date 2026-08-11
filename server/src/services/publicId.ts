import { randomInt } from 'node:crypto';

export function createPublicRideId() {
  const block = randomInt(0, 999999).toString().padStart(6, '0');
  return `SAM-${block}`;
}
