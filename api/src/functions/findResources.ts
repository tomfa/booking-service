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
  let resourceQuery = await db.resource
    .getRepository()
    .whereEqualTo('enabled', enabled);

  if (resourceIds) {
    resourceQuery = resourceQuery.whereIn('id', resourceIds);
  }

  if (args.customerId) {
    resourceQuery = resourceQuery.whereEqualTo('customerId', args.customerId);
  }

  if (args.category) {
    resourceQuery = resourceQuery.whereEqualTo('category', args.category);
  }

  if (args.label) {
    resourceQuery = resourceQuery.whereEqualTo('label', args.label);
  }

  const resources = await resourceQuery.find();

  return resources.map(fromDBResource);
}

export default findResources;
