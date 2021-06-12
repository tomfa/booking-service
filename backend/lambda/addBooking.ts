import db from './db';
import { AddBookingInput } from './types';
import { Tables } from './constants';
const { v4: uuid } = require('uuid');

async function addBooking(booking: AddBookingInput) {
  if (!booking.id) booking.id = uuid();
  const {
    id,
    customerId,
    userId,
    resourceId,
    start,
    end,
    canceled = false,
    comment = '',
    seatNumber,
  } = booking;
  try {
    const query = `INSERT INTO ${Tables.Booking} (id,customerId,userId,resourceId,start,end,canceled,comment,seatNumber) VALUES(:id,:customerId,:userId,:resourceId,:start,:end,:canceled,:comment,:seatNumber)`;
    await db.query(query, {
      id,
      customerId,
      userId,
      resourceId,
      start,
      end,
      canceled,
      comment,
      seatNumber,
    });
    return booking;
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default addBooking;
