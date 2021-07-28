import { db } from '../db/client';
import { QueryGetResourceByIdArgs, Resource } from '../graphql/generated/types';
import { fromDBResource } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

async function getResourceById(
  { id }: QueryGetResourceByIdArgs,
  token: Auth
): Promise<Resource | null> {
  verifyPermission(token, permissions.GET_RESOURCE);

  const resource = await db.resource.findById(id);
  if (!resource) {
    return null;
  }
  if (resource.customerId !== token.customerId) {
    verifyPermission(token, permissions.ALL);
  }
  return fromDBResource(resource);
}

export default getResourceById;
