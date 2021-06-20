import { PrismaClient } from '@prisma/client';
import { TimeSlot } from '../../graphql/generated/types';
import findAvailability from './findAvailability';

async function getNextAvailable(
  db: PrismaClient,
  id: string,
  afterDate: number
): Promise<TimeSlot | null> {
  const slots = await findAvailability(db, {
    from: afterDate,
    resourceIds: [id],
  });

  const firstAvailableSlot = slots
    .sort((a, b) => {
      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;
      return 0;
    })
    .find(s => s.availableSeats > 0);
  return firstAvailableSlot || null;
}

export default getNextAvailable;
