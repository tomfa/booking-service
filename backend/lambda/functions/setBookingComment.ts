import { PrismaClient } from '@prisma/client';
import { Booking } from '../../graphql/generated/types';
import { fromDBBooking } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';

async function setBookingComment(
  db: PrismaClient,
  id: string,
  comment: string | null,
  token: AuthToken
): Promise<Booking> {
  // TODO: What if ID does not exits
  try {
    const booking = await db.booking.update({
      where: { id },
      data: { comment },
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
