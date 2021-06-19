import { PrismaClient } from '@prisma/client/scripts/default-index';
import { Booking } from '../../graphql/generated/types';
import { fromDBBooking } from '../utils/db.mappers';

async function getBookingById(
  db: PrismaClient,
  id: string
): Promise<Booking | null> {
  // TODO: What if id does not exist?
  const booking = await db.booking.findUnique({
    where: { id },
    include: { resource: true },
  });
  return booking && fromDBBooking(booking);
}

export default getBookingById;
