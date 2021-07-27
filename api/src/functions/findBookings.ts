import { Booking, QueryFindBookingsArgs } from '../graphql/generated/types';
import { fromDBBooking, getFilteredBookings } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function findBookings(
  { filterBookings: args }: QueryFindBookingsArgs,
  token?: AuthToken
): Promise<Booking[]> {
  const customerId = token.customerId;
  // TODO: Support querying for any customerId by superuser
  const bookings = await getFilteredBookings({ ...args, customerId }).find();
  return bookings.map(fromDBBooking);
}

export default findBookings;
