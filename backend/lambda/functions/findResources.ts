import { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client/scripts/default-index';
import {
  FindResourceInput,
  Resource,
  Schedule,
} from '../../graphql/generated/types';
import { removeNull } from '../utils/input.mappers';
import { closedSchedule } from '../utils/schedule';
import { fromDBResource } from '../utils/db.mappers';

const mapSchedule = (val: Prisma.JsonValue): Schedule => {
  if (!val) {
    return closedSchedule;
  }
  return val as Schedule;
};

async function findResources(
  db: PrismaClient,
  args: FindResourceInput
): Promise<Resource[]> {
  const resources = await db.resource.findMany({
    where: removeNull(args),
  });
  const resource = resources[0];
  console.log('resource', JSON.stringify(resource));
  console.log('typeof resource.schedule', typeof resource.schedule);
  console.log('resource.schedule', resource.schedule);
  return resources.map(fromDBResource);
}

export default findResources;
