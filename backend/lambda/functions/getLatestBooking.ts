import { PrismaClient } from '@prisma/client/scripts/default-index';
import { Booking, FindBookingInput } from '../../graphql/generated/types';

async function getLatestBooking(
  db: PrismaClient,
  args: FindBookingInput
): Promise<Booking | null> {
  // TODO
  return null;
}

export default getLatestBooking;
