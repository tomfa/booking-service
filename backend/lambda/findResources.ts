import { FindResourceInput } from './types';
import { getDB } from './db';

async function findResources(args: FindResourceInput) {
  try {
    const db = await getDB();
    return db.resource.findMany({
      where: args,
    });
  } catch (err) {
    console.log('Postgres error: ', err);
    return { error: String(err) };
  }
}

export default findResources;
