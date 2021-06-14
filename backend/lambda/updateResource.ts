import { UpdateResourceInput } from '../graphql/generated/types';
import { getDB } from './db';
import { removeNull } from './utils/mappers';

async function updateResource(args: UpdateResourceInput) {
  try {
    const db = await getDB();
    return await db.customer.update({
      where: { id: args.id },
      data: removeNull(args),
    });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default updateResource;
