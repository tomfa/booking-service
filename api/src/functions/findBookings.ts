import { Booking, QueryFindBookingsArgs } from '../graphql/generated/types';
import { fromDBBooking, getFilteredBookings } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function findBookings(
  { filterBookings: args }: QueryFindBookingsArgs,
  token?: AuthToken
): Promise<Booking[]> {
  // TODO: Support querying for any customerId by superuser
  const customerId = token.customerId;
  const bookingsQuery = await getFilteredBookings({ ...args, customerId });
  const bookings = await bookingsQuery.find();
  return bookings.map(fromDBBooking);
}

export default findBookings;
