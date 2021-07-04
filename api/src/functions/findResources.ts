import { db } from '../db/client';

import { FindResourceInput, Resource } from '../graphql/generated/types';
import { removeNull } from '../utils/input.mappers';
import { fromDBResource } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function findResources(
  { resourceIds, ...args }: FindResourceInput,
  token: AuthToken
): Promise<Resource[]> {
  const clean = removeNull({ ...args });
  const enabled = clean.enabled === false ? clean.enabled : true;
  const resources = await db.resource.findMany({
    where: {
      ...clean,
      id: (resourceIds && { in: resourceIds }) || undefined,
      enabled,
    },
  });
  console.log('resources', resources);
  return resources.map(fromDBResource);
}

export default findResources;
