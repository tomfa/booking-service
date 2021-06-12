import { FindResourceInput } from './types';
import db from './db';
import { Tables } from './constants';

async function findResources(args: FindResourceInput) {
  try {
    const filterValues = Object.keys(args)
      .map(k => `${k} = :${k}`)
      .join(' AND ');
    const query = `SELECT * FROM ${Tables.Resource} WHERE ${filterValues}`
    console.log(`Executing ${query}`);
    const result = await db.query(query);
    console.log(`result: ${JSON.stringify(result)}`);
    return result.records;
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default findResources
