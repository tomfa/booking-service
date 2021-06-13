import { FindBookingInput } from './types';
import db from './db';
import { Tables } from './constants';

async function findBookings(args: FindBookingInput) {
  try {
    const filterValues = Object.keys(args)
      .map(k => `${k} = :${k}`)
      .join(' AND ');
    const whereQuery = filterValues ? ` WHERE ${filterValues}` : '';
    const result = await db.query(
      `SELECT * FROM ${Tables.Booking} ${whereQuery}`,
      args
    );
    return result.records;
  } catch (err) {
    console.log('Postgres error: ', err);
    return { error: String(err) };
  }
}

export default findBookings;
