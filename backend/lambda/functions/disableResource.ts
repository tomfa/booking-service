import { Resource } from '../../graphql/generated/types';
import { getDB } from '../db';
import { fromDBResource } from '../utils/db.mappers';

async function disableResource(id: string): Promise<Resource> {
  // TODO: What if id does not exist?
  const db = await getDB();
  const resource = await db.resource.update({
    where: { id },
    data: { enabled: false },
  });
  return fromDBResource(resource);
}

export default disableResource;
