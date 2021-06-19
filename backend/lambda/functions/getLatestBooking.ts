import { Booking, FindBookingInput } from '../../graphql/generated/types';

async function getLatestBooking(
  args: FindBookingInput
): Promise<Booking | null> {
  // TODO
  return null;
}

export default getLatestBooking;
