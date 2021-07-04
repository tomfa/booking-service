import { db } from '../db/client';
import { Booking, QueryGetBookingByIdArgs } from '../graphql/generated/types';
import { fromDBBooking } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getBookingById(
  { id }: QueryGetBookingByIdArgs,
  token: AuthToken
): Promise<Booking | null> {
  // TODO: What if id does not exist?
  const booking = await db.booking.findUnique({
    where: { id },
    include: { resource: true },
  });
  return booking && fromDBBooking(booking);
}

export default getBookingById;
