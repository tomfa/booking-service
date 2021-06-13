import { FindResourceInput } from './types';
import db from './db';
import { Tables } from './constants';

async function findResources(args: FindResourceInput) {
  try {
    const filterValues = Object.keys(args)
      .map(k => `${k} = :${k}`)
      .join(' AND ');
    const query = filterValues
      ? `SELECT * FROM ${Tables.Resource} WHERE ${filterValues}`
      : `SELECT * FROM ${Tables.Resource}`;
    console.log(`query: ${query}`);
    if (!filterValues) {
      const result = await db.query(`SELECT * FROM ${Tables.Resource}`);
      console.log(`result: ${JSON.stringify(result)}`);
      return result.records;
    }

    const result = await db.query(
      `SELECT * FROM ${Tables.Resource} WHERE ${filterValues}`,
      args
    );
    console.log(`result: ${JSON.stringify(result)}`);
    return result.records;
  } catch (err) {
    console.log('Postgres error: ', err);
    return { error: String(err) };
  }
}

export default findResources;
