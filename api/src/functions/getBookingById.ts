import { db } from '../db/client';
import { Booking, QueryGetBookingByIdArgs } from '../graphql/generated/types';
import { fromDBBooking } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

async function getBookingById(
  { id }: QueryGetBookingByIdArgs,
  token: Auth
): Promise<Booking | null> {
  verifyPermission(token, permissions.GET_OWN_BOOKING);
  const booking = await db.booking.findById(id);
  if (!booking) {
    return null;
  }
  if (token.sub !== booking.userId) {
    verifyPermission(token, permissions.GET_ANY_BOOKING);
  }
  if (token.customerId !== booking.customerId) {
    verifyPermission(token, permissions.ALL);
  }
  return booking && fromDBBooking(booking);
}

export default getBookingById;
