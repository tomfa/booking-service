import { AddBookingInput, Booking } from '../graphql/generated/types';
import { getDB } from './db';
import { getId } from './utils/input.mappers';
import { fromDBBooking } from './utils/db.mappers';
import { genericErrorResponse } from './utils/response';
import { ErrorType } from './utils/types';

async function addBooking({
  start,
  end,
  canceled,
  ...booking
}: AddBookingInput): Promise<Booking | ErrorType> {
  const db = await getDB();
  try {
    // TODO: Error handling
    //  - what if id already exists
    const dbBooking = await db.booking.create({
      data: {
        ...booking,
        canceled: !!canceled,
        id: getId(booking.id),
        startTime: new Date(start),
        endTime: new Date(end),
      },
    });
    return fromDBBooking(dbBooking);
  } catch (err) {
    console.log('Postgres error: ', err);
    return genericErrorResponse;
  }
}

export default addBooking;
