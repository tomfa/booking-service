import { Prisma } from '@prisma/client';
import { Resource, UpdateResourceInput } from '../graphql/generated/types';
import { getDB } from './db';
import { mapSchedule, removeNull } from './utils/input.mappers';
import { fromDBResource } from './utils/db.mappers';

const mapResourceUpdate = (
  args: UpdateResourceInput
): Prisma.resourceUpdateInput => {
  // TODO: Check how one can set null, and how we handle it.
  if (args.schedule) {
    return {
      ...removeNull(args),
      schedule: mapSchedule(args.schedule),
    };
  }
  return removeNull(args);
};

async function updateResource(
  args: UpdateResourceInput
): Promise<Resource | null> {
  // TODO: What if id does not exist?
  const db = await getDB();
  const resource = await db.resource.update({
    where: { id: args.id },
    data: mapResourceUpdate(args),
  });
  return fromDBResource(resource);
}

export default updateResource;
