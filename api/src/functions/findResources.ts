import { db } from '../db/client';

import { QueryFindResourcesArgs, Resource } from '../graphql/generated/types';
import { removeNull } from '../utils/input.mappers';
import { fromDBResource } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function findResources(
  { filterResource }: QueryFindResourcesArgs,
  token: AuthToken
): Promise<Resource[]> {
  const { resourceIds, ...args } = filterResource;
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
