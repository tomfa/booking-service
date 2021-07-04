import { db } from '../db/client';
import { Booking, QueryFindBookingsArgs } from '../graphql/generated/types';
import { fromDBBooking, toBookingFilter } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function findBookings(
  { filterBookings: args }: QueryFindBookingsArgs,
  token?: AuthToken
): Promise<Booking[]> {
  const bookings = await db.booking.findMany({
    where: toBookingFilter(args),
    include: { resource: true },
  });
  return bookings.map(fromDBBooking);
}

export default findBookings;
