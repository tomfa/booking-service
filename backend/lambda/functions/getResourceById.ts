import { PrismaClient } from '@prisma/client';
import { Resource } from '../../graphql/generated/types';
import { fromDBResource } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getResourceById(
  db: PrismaClient,
  id: string,
  token: AuthToken
): Promise<Resource | null> {
  // TODO: What if id does not exist?

  const resource = await db.resource.findUnique({ where: { id } });
  return resource && fromDBResource(resource);
}

export default getResourceById;
