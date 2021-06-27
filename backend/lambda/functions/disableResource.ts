import { PrismaClient } from '@prisma/client';
import { Resource } from '../../graphql/generated/types';
import { fromDBResource } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function disableResource(
  db: PrismaClient,
  id: string,
  token: AuthToken
): Promise<Resource> {
  // TODO: What if id does not exist?

  const resource = await db.resource.update({
    where: { id },
    data: { enabled: false },
  });
  return fromDBResource(resource);
}

export default disableResource;
