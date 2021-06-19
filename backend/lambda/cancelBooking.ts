import { Booking } from '../graphql/generated/types';
import { getDB } from './db';
import { fromDBBooking } from './utils/db.mappers';

async function cancelBooking(id: string): Promise<Booking> {
  // TODO: What if ID does not exits
  const db = await getDB();
  const booking = await db.booking.update({
    where: { id },
    data: { canceled: true },
  });
  return fromDBBooking(booking);
}

export default cancelBooking;
