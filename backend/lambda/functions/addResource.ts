import { AddResourceInput, Resource } from '../../graphql/generated/types';
import { getDB } from '../db';
import { fromDBResource } from '../utils/db.mappers';
import { getId, mapSchedule } from '../utils/input.mappers';

async function addResource({
  id,
  enabled = true,
  label = '',
  schedule,
  ...resource
}: AddResourceInput): Promise<Resource> {
  // TODO: Error handling
  //  - what if id already exists
  //  - what if same label exists
  // const resourceWithSameLabel = this.resources.find(
  //   r => r.label === resource.label
  // );
  // if (resourceWithSameLabel) {
  //   throw new ConflictingObjectExists(
  //     `Resource with label ${resource.label} already exists`,
  //     ErrorCode.CONFLICTS_WITH_EXISTING_RESOURCE
  //   );
  // }

  // const resourceWithSameId = this.resources.find(r => r.id === resourceId);
  // if (resourceWithSameId) {
  //   throw new ConflictingObjectExists(
  //     `Resource with id ${id} already exists`,
  //     ErrorCode.CONFLICTS_WITH_EXISTING_RESOURCE
  //   );
  // }

  const mappedSchedule = mapSchedule(schedule);
  const db = await getDB();
  const result = await db.resource.create({
    data: {
      enabled,
      id: getId(id),
      label,
      schedule: mappedSchedule,
      ...resource,
      customerId: resource.customerId || 'tomfa', // TODO
    },
  });
  return fromDBResource(result);
}

export default addResource;
