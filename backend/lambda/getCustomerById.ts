import db from './db';
import { Tables } from './constants';

async function getCustomerById(id: string) {
  try {
    const query = `SELECT * FROM ${Tables.Customer} WHERE id = :id`;
    const results = await db.query(query, { id });
    return results.records[0];
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default getCustomerById
