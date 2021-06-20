import { PrismaClient } from '@prisma/client/scripts/default-index';
import {
  BookedDuration,
  FindBookingInput,
} from '../../graphql/generated/types';
import { sumArray } from '../utils/array.utils';
import { getBookingDurationMinutes } from '../utils/booking.utils';
import findBookings from './findBookings';

async function getBookedDuration(
  db: PrismaClient,
  args: FindBookingInput
): Promise<BookedDuration> {
  const bookings = await findBookings(db, args);
  return {
    minutes: sumArray(bookings.map(getBookingDurationMinutes)),
    numBookings: bookings.length,
    bookingIds: bookings.map(b => b.id),
  };
}

export default getBookedDuration;
