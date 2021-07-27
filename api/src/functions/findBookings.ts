import { Booking, QueryFindBookingsArgs } from '../graphql/generated/types';
import { fromDBBooking, getFilteredBookings } from '../utils/db.mappers';
import { Auth } from '../auth/types';

async function findBookings(
  { filterBookings: args }: QueryFindBookingsArgs,
  token?: Auth
): Promise<Booking[]> {
  // TODO: Support querying for any customerId by superuser
  const customerId = token.customerId;
  const bookingsQuery = await getFilteredBookings({ ...args, customerId });
  const bookings = await bookingsQuery.find();
  return bookings.map(fromDBBooking);
}

export default findBookings;
