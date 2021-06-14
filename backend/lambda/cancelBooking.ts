import { Booking } from '../graphql/generated/types';
import { getDB } from './db';
import { fromDBBooking } from './utils/db.mappers';
import { genericErrorResponse } from './utils/response';
import { ErrorType } from './utils/types';

async function cancelBooking(id: string): Promise<Booking | ErrorType> {
  try {
    const db = await getDB();
    const booking = await db.booking.update({
      where: { id },
      data: { canceled: true },
    });
    return fromDBBooking(booking);
  } catch (err) {
    console.log('Postgres error: ', err);
    return genericErrorResponse;
  }
}

export default cancelBooking;
