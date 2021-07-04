import {
  BookedDuration,
  QueryGetBookedDurationArgs,
} from '../graphql/generated/types';
import { sumArray } from '../utils/array.utils';
import { getBookingDurationMinutes } from '../utils/booking.utils';
import { AuthToken } from '../auth/types';
import findBookings from './findBookings';

async function getBookedDuration(
  { filterBookings: args }: QueryGetBookedDurationArgs,
  token: AuthToken
): Promise<BookedDuration> {
  const bookings = await findBookings({ filterBookings: args }, token);
  return {
    minutes: sumArray(bookings.map(getBookingDurationMinutes)),
    numBookings: bookings.length,
    bookingIds: bookings.map(b => b.id),
  };
}

export default getBookedDuration;
