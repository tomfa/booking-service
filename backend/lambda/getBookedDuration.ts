import { BookedDuration, FindBookingInput } from '../graphql/generated/types';

async function getBookedDuration(
  args: FindBookingInput
): Promise<BookedDuration> {
  // TODO
  return {
    minutes: 0,
    numBookings: 0,
    bookingIds: [],
  };
}

export default getBookedDuration;
