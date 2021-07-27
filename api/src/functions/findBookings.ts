import { Booking, QueryFindBookingsArgs } from '../graphql/generated/types';
import { fromDBBooking, getFilteredBookings } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

async function findBookings(
  { filterBookings: args }: QueryFindBookingsArgs,
  token?: Auth
): Promise<Booking[]> {
  const customerId = args.customerId || token.customerId;
  if (customerId !== token.customerId) {
    verifyPermission(token, permissions.ALL);
  }
  if (args.userId !== token.sub) {
    verifyPermission(token, permissions.GET_ANY_BOOKING);
  }
  const bookingsQuery = await getFilteredBookings({ ...args, customerId });
  const bookings = await bookingsQuery.find();
  return bookings.map(fromDBBooking);
}

export default findBookings;
