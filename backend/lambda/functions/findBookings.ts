import { Booking, FindBookingInput } from '../../graphql/generated/types';
import { getDB } from '../db';
import { fromDBBooking } from '../utils/db.mappers';

async function findBookings({
  resourceIds,
  from,
  to,
  includeCanceled,
  ...args
}: FindBookingInput): Promise<Booking[]> {
  const db = await getDB();
  const bookings = await db.booking.findMany({
    where: {
      resourceId: (resourceIds && { in: resourceIds }) || undefined,
      startTime: from ? { gte: new Date(from) } : undefined,
      endTime: to ? { lte: new Date(to) } : undefined,
      canceled: !includeCanceled ? false : undefined,
      ...args,
    },
    include: { resource: true },
  });
  console.log('bookings', JSON.stringify(bookings));
  return bookings.map(fromDBBooking);
}

export default findBookings;
