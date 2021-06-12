import db from './db';
import { Tables } from './constants';

async function disableCustomer(id: string) {
  try {
    const query = `UPDATE ${Tables.Customer} set enabled = false WHERE id = :id`;
    const results = await db.query(query, { id });
    return results.records[0];
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default disableCustomer
