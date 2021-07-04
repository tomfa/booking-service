import { Booking, QueryFindBookingsArgs } from '../graphql/generated/types';
import { fromDBBooking, getFilteredBookings } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function findBookings(
  { filterBookings: args }: QueryFindBookingsArgs,
  token?: AuthToken
): Promise<Booking[]> {
  const bookings = await getFilteredBookings(args).find();
  return bookings.map(fromDBBooking);
}

export default findBookings;
