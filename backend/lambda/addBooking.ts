import { getDB } from './db';
import { AddBookingInput } from './types';

const { v4: uuid } = require('uuid');

async function addBooking({ start, end, ...booking }: AddBookingInput) {
  const db = await getDB();
  const defaultValues: Partial<AddBookingInput> = {
    id: uuid(),
    canceled: false,
    comment: '',
  };
  try {
    return await db.booking.create({
      data: {
        ...defaultValues,
        ...booking,
        startTime: new Date(start),
        endTime: new Date(end),
      },
    });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default addBooking;
