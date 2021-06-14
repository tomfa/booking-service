import { Booking } from '../graphql/generated/types';
import { getDB } from './db';
import { ErrorType } from './utils/types';
import { genericErrorResponse } from './utils/response';
import { fromDBBooking } from './utils/db.mappers';

async function getBookingById(id: string): Promise<Booking | null | ErrorType> {
  try {
    const db = await getDB();
    const booking = await db.booking.findUnique({
      where: { id },
      include: { resource: true },
    });
    return booking && fromDBBooking(booking);
  } catch (err) {
    console.log('Postgres error: ', err);
    return genericErrorResponse;
  }
}

export default getBookingById;
