import { PrismaClient } from '@prisma/client';

import { FindResourceInput, Resource } from '../../graphql/generated/types';
import { removeNull } from '../utils/input.mappers';
import { fromDBResource } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function findResources(
  db: PrismaClient,
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
  return resources.map(fromDBResource);
}

export default findResources;
