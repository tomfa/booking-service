import { Booking, QueryGetLatestBookingArgs } from '../graphql/generated/types';
import { fromDBBooking, getFilteredBookings } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

async function getLatestBooking(
  { filterBookings: args }: QueryGetLatestBookingArgs,
  token: Auth
): Promise<Booking | null> {
  const customerId = args.customerId || token.customerId;
  if (customerId !== token.customerId) {
    verifyPermission(token, permissions.ALL);
  }
  const userId = args.userId || token.sub;
  if (userId !== token.sub) {
    verifyPermission(token, permissions.GET_ANY_BOOKING);
  }
  verifyPermission(token, permissions.GET_OWN_BOOKING);

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
