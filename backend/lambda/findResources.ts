import { Prisma, resource as DBResource } from '@prisma/client';
import {
  FindResourceInput,
  HourSchedule,
  Resource,
  Schedule,
} from '../graphql/generated/types';
import { getDB } from './db';
import { removeNull } from './utils/mappers';
import { ErrorType } from './utils/types';

const closed: HourSchedule = {
  start: '00:00',
  end: '00:00',
  slotIntervalMinutes: 0,
  slotDurationMinutes: 0,
};
const closedSchedule: Schedule = {
  mon: closed,
  tue: closed,
  wed: closed,
  thu: closed,
  fri: closed,
  sat: closed,
  sun: closed,
  overriddenDates: [],
};
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
    const mappedResources: Resource[] = resources.map(
      (r: DBResource): Resource => ({
        ...r,
        schedule: mapSchedule(r.schedule),
      })
    );
    return mappedResources;
  } catch (err) {
    console.log('Postgres error: ', err);
    return { error: String(err) };
  }
}

export default findResources;
