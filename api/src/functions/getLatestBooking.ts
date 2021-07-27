import { Booking, QueryGetLatestBookingArgs } from '../graphql/generated/types';
import { fromDBBooking, getFilteredBookings } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getLatestBooking(
  { filterBookings: args }: QueryGetLatestBookingArgs,
  token: AuthToken
): Promise<Booking | null> {
  // TODO: Support searching for any customerId for superuser
  const queryBuilder = await getFilteredBookings({
    ...args,
    customerId: token.customerId,
  });
  const booking = await queryBuilder.orderByDescending('start').findOne();
  if (!booking) {
    return null;
  }
  return fromDBBooking(booking);
}
export default getLatestBooking;
