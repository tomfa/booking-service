import { PrismaClient } from '@prisma/client';
import { Resource } from '../../graphql/generated/types';
import { fromDBResource } from '../utils/db.mappers';

async function getResourceById(
  db: PrismaClient,
  id: string
): Promise<Resource | null> {
  // TODO: What if id does not exist?

  const resource = await db.resource.findUnique({ where: { id } });
  return resource && fromDBResource(resource);
}

export default getResourceById;
