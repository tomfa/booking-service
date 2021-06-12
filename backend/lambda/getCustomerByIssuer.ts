import db from './db';
import { Tables } from './constants';

async function getCustomerByEmail(issuer: string) {
  try {
    const query = `SELECT * FROM ${Tables.Customer} WHERE issuer = :issuer`;
    const results = await db.query(query, { issuer });
    return results.records[0];
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default getCustomerByEmail
