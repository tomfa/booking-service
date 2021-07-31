import { Booking, QueryFindBookingsArgs } from '../graphql/generated/types';
import { fromDBBooking, getFilteredBookings } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import {
  hasPermission,
  permissions,
  verifyPermission,
} from '../auth/permissions';

async function findBookings(
  { filterBookings: args }: QueryFindBookingsArgs,
  token?: Auth
): Promise<Booking[]> {
  const customerId = args.customerId || token.customerId;
  let userId = args.userId;
  if (customerId !== token.customerId) {
    verifyPermission(token, permissions.ALL);
  }
  if (userId && userId !== token.sub) {
    verifyPermission(token, permissions.GET_ANY_BOOKING);
  } else if (!hasPermission(token, permissions.GET_ANY_BOOKING)) {
    userId = token.sub;
    verifyPermission(token, permissions.GET_OWN_BOOKING);
  }
  const bookingsQuery = await getFilteredBookings({
    ...args,
    userId,
    customerId,
  });
  const bookings = await bookingsQuery.find();
  return bookings.map(fromDBBooking);
}

export default findBookings;
