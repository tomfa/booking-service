import { db } from '../db/client';
import { Booking, QueryGetLatestBookingArgs } from '../graphql/generated/types';
import { fromDBBooking, toBookingFilter } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getLatestBooking(
  { filterBookings: args }: QueryGetLatestBookingArgs,
  token: AuthToken
): Promise<Booking | null> {
  const filter = toBookingFilter(args);
  const bookings = await db.booking.findMany({
    orderBy: [{ startTime: 'desc' }],
    where: filter,
    take: 1,
    include: { resource: true },
  });
  if (!bookings.length) {
    return null;
  }
  return fromDBBooking(bookings[0]);
}
export default getLatestBooking;
