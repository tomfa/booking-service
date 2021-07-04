import { Booking, QueryGetLatestBookingArgs } from '../graphql/generated/types';
import { fromDBBooking, getFilteredBookings } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getLatestBooking(
  { filterBookings: args }: QueryGetLatestBookingArgs,
  token: AuthToken
): Promise<Booking | null> {
  const queryBuilder = getFilteredBookings(args).orderByDescending('start');
  const bookings = await queryBuilder.findOne();
  return fromDBBooking(bookings);
}
export default getLatestBooking;
