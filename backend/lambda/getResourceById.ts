import { Resource } from '../graphql/generated/types';
import { getDB } from './db';
import { fromDBResource } from './utils/db.mappers';

async function getResourceById(id: string): Promise<Resource | null> {
  // TODO: What if id does not exist?
  const db = await getDB();
  const resource = await db.resource.findUnique({ where: { id } });
  return resource && fromDBResource(resource);
}

export default getResourceById;
