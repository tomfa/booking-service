import { db } from '../db/client';
import { QueryGetResourceByIdArgs, Resource } from '../graphql/generated/types';
import { fromDBResource } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getResourceById(
  { id }: QueryGetResourceByIdArgs,
  token: AuthToken
): Promise<Resource | null> {
  // TODO: What if id does not exist?

  const resource = await db.resource.findUnique({ where: { id } });
  return resource && fromDBResource(resource);
}

export default getResourceById;
