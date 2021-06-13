import { FindBookingInput } from './types';
import { getDB } from './db';

async function findBookings({
  resourceIds,
  from,
  to,
  includeCanceled,
  ...args
}: FindBookingInput) {
  try {
    const db = await getDB();
    return db.booking.findMany({
      where: {
        resourceId: resourceIds && { in: resourceIds },
        startTime: from !== undefined ? { gte: new Date(from) } : undefined,
        endTime: to !== undefined ? { lte: new Date(to) } : undefined,
        canceled: includeCanceled,
        ...args,
      },
      include: { resource: true },
    });
  } catch (err) {
    console.log('Postgres error: ', err);
    return { error: String(err) };
  }
}

export default findBookings;
