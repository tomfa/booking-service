import { db } from '../db/client';
import { Booking, MutationCancelBookingArgs } from '../graphql/generated/types';
import { fromDBBooking } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { ErrorCode, ObjectDoesNotExist } from '../utils/errors';
import { permissions, verifyPermission } from '../auth/permissions';

async function cancelBooking(
  { id }: MutationCancelBookingArgs,
  token: Auth
): Promise<Booking> {
  verifyPermission(token, permissions.CANCEL_OWN_BOOKING);
  const existing = await db.booking.findById(id);
  if (!existing) {
    throw new ObjectDoesNotExist(
      `Booking with id ${id} not found`,
      ErrorCode.BOOKING_DOES_NOT_EXIST
    );
  }
  if (existing.customerId !== token.customerId) {
    // TODO: Better message
    verifyPermission(token, permissions.ALL);
  }
  if (existing.userId !== token.sub) {
    verifyPermission(token, permissions.CANCEL_ANY_BOOKING);
  }
  const booking = await db.booking.update({
    ...existing,
    canceled: true,
  });
  return fromDBBooking(booking);
}

export default cancelBooking;
