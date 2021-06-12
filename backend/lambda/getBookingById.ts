import db from './db';
import { Tables } from './constants';

async function getBookingById(id: string) {
  try {
    const query = `SELECT * FROM ${Tables.Booking} WHERE id = :id`;
    const results = await db.query(query, { id });
    return results.records[0];
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default getBookingById
