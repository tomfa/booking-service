import { PrismaClient } from '@prisma/client/scripts/default-index';
import {
  BookedDuration,
  FindBookingInput,
} from '../../graphql/generated/types';

async function getBookedDuration(
  db: PrismaClient,
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
