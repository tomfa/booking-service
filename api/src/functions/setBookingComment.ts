import { db } from '../db/client';
import {
  Booking,
  MutationSetBookingCommentArgs,
} from '../graphql/generated/types';
import { fromDBBooking } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';

export type SetBookingCommentInput = {
  id: string;
  comment: string | null;
};
async function setBookingComment(
  { id, comment }: MutationSetBookingCommentArgs,
  token: Auth
): Promise<Booking> {
  // TODO: What if ID does not exits
  try {
    const existing = await db.booking.findById(id);
    const booking = await db.booking.update({
      ...existing,
      comment,
    });
    return fromDBBooking(booking);
  } catch (e) {
    if (e.code === 'P2025') {
      throw new ObjectDoesNotExist(
        `Booking with id ${id} not found`,
        ErrorCode.BOOKING_DOES_NOT_EXIST
      );
    }
    console.log(`Unhandled error: ${e}`);
    throw new GenericBookingError(
      `setBookingComment failed with unknown error`,
      e.code || ErrorCode.UNKNOWN_ERROR
    );
  }
}

export default setBookingComment;
