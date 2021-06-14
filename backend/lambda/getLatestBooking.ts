import { Booking, FindBookingInput } from '../graphql/generated/types';

async function getLatestBooking(
  args: FindBookingInput
): Promise<Booking | undefined> {
  // TODO
  return undefined;
}

export default getLatestBooking;
