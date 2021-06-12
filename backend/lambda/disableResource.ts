import { Tables } from './constants';
import db from './db';

async function disableResource(id: string) {
  try {
    const query = `UPDATE ${Tables.Resource} set enabled = false WHERE id = :id`;
    const results = await db.query(query, { id });
    return results.records[0];
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default disableResource
