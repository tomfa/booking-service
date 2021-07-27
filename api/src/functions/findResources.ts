import { db } from '../db/client';

import { QueryFindResourcesArgs, Resource } from '../graphql/generated/types';
import { removeNull } from '../utils/input.mappers';
import { fromDBResource } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

async function findResources(
  { filterResource }: QueryFindResourcesArgs,
  token: Auth
): Promise<Resource[]> {
  verifyPermission(token, permissions.GET_RESOURCE);
  const { resourceIds, ...args } = filterResource;
  const clean = removeNull({ ...args });
  const enabled = clean.enabled === false ? clean.enabled : true;
  let resourceQuery = await db.resource
    .getRepository()
    .whereEqualTo('enabled', enabled);

  if (resourceIds) {
    resourceQuery = resourceQuery.whereIn('id', resourceIds);
  }

  const customerId = args.customerId || token.customerId;
  if (customerId !== token.customerId) {
    verifyPermission(token, permissions.ALL);
  }
  resourceQuery = resourceQuery.whereEqualTo('customerId', customerId);

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
