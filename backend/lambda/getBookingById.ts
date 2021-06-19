import { Booking } from '../graphql/generated/types';
import { getDB } from './db';
import { fromDBBooking } from './utils/db.mappers';

async function getBookingById(id: string): Promise<Booking | null> {
  const db = await getDB();
  // TODO: What if id does not exist?
  const booking = await db.booking.findUnique({
    where: { id },
    include: { resource: true },
  });
  return booking && fromDBBooking(booking);
}

export default getBookingById;
