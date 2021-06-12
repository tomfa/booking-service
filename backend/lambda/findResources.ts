import { FindResourceInput } from './types';
import db from './db';
import { Tables } from './constants';

async function findResources(args: FindResourceInput) {
  try {
    const filterValues = Object.keys(args)
      .map(k => `${k} = :${k}`)
      .join(' AND ');
    const result = await db.query(`SELECT * FROM ${Tables.Resource} WHERE ${filterValues}`);
    return result.records;
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default findResources
