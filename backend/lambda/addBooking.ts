import { AddBookingInput } from '../graphql/generated/types';
import { getDB } from './db';
import { getId } from './utils/mappers';

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
        id: getId(booking.id),
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
