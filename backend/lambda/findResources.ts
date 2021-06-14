import { Prisma } from '@prisma/client';
import {
  FindResourceInput,
  Resource,
  Schedule,
} from '../graphql/generated/types';
import { getDB } from './db';
import { removeNull } from './utils/input.mappers';
import { ErrorType } from './utils/types';
import { closedSchedule } from './utils/schedule';
import { fromDBResource } from './utils/db.mappers';

const mapSchedule = (val: Prisma.JsonValue): Schedule => {
  if (!val) {
    return closedSchedule;
  }
  return val as Schedule;
};

async function findResources(
  args: FindResourceInput
): Promise<Resource[] | ErrorType> {
  try {
    const db = await getDB();
    const resources = await db.resource.findMany({
      where: removeNull(args),
    });
    const resource = resources[0];
    console.log('resource', JSON.stringify(resource));
    console.log('typeof resource.schedule', typeof resource.schedule);
    console.log('resource.schedule', resource.schedule);
    return resources.map(fromDBResource);
  } catch (err) {
    console.log('Postgres error: ', err);
    return { error: String(err) };
  }
}

export default findResources;
