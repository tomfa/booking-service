import { AddResourceInput } from '../graphql/generated/types';
import { getDB } from './db';
import { getId } from './utils/mappers';

async function addResource({
  id,
  enabled = true,
  label = '',
  ...resource
}: AddResourceInput) {
  try {
    const db = await getDB();
    return await db.resource.create({
      data: { enabled, id: getId(id), label, ...resource },
    });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default addResource;
