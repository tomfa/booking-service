import { UpdateResourceInput } from './types';
import { Tables } from './constants';
import db from './db';

async function updateResource(args: UpdateResourceInput) {
  const valuesUpdates = Object.keys(args)
    .filter(k => k !== 'id')
    .map(k => `${k} = :${k}`)
    .join(', ');
  try {
    const query = `UPDATE ${Tables.Resource} set ${valuesUpdates} WHERE id = :id`;
    const results = await db.query(query, args);
    return results.records[0];
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default updateResource