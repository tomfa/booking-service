import { UpdateResourceInput } from './types';
import { getDB } from './db';

async function updateResource(args: UpdateResourceInput) {
  try {
    const db = await getDB();
    return await db.customer.update({ where: { id: args.id }, data: args });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default updateResource;
