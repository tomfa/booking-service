import { Booking, FindBookingInput } from '../graphql/generated/types';
import { getDB } from './db';
import { ErrorType } from './utils/types';

async function findBookings({
  resourceIds,
  from,
  to,
  includeCanceled,
  ...args
}: FindBookingInput): Promise<Booking[] | ErrorType> {
  try {
    const db = await getDB();
    const bookings = await db.booking.findMany({
      where: {
        resourceId: resourceIds && { in: resourceIds },
        startTime: from ? { gte: new Date(from) } : undefined,
        endTime: to ? { lte: new Date(to) } : undefined,
        canceled: includeCanceled,
        ...args,
      },
      include: { resource: true },
    });
    console.log('bookings', JSON.stringify(bookings));
    return [];
  } catch (err) {
    console.log('Postgres error: ', err);
    return { error: String(err) };
  }
}

export default findBookings;
