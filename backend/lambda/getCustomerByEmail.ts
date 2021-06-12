import db from './db';
import { Tables } from './constants';

async function getCustomerByEmail(email: string) {
  try {
    const query = `SELECT * FROM ${Tables.Customer} WHERE email = :email`;
    const results = await db.query(query, { email });
    return results.records[0];
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default getCustomerByEmail
