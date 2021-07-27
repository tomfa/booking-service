import { Booking, QueryGetLatestBookingArgs } from '../graphql/generated/types';
import { fromDBBooking, getFilteredBookings } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getLatestBooking(
  { filterBookings: args }: QueryGetLatestBookingArgs,
  token: AuthToken
): Promise<Booking | null> {
  const queryBuilder = getFilteredBookings(args).orderByDescending('start');
  const booking = await queryBuilder.findOne();
  if (!booking) {
    return null;
  }
  return fromDBBooking(booking);
}
export default getLatestBooking;
