import { FindAvailabilityInput } from '../../graphql/generated/types';

async function findAvailability(args: FindAvailabilityInput) {
  // TODO: This is a different function?
  //
  // const from = props.from || new Date();
  //     const to = props.to || new Date(from.getTime() + 31 * 24 * 3600 * 1000);
  //
  //     const resource = await this.getResource(resourceId);
  //     if (!resource.enabled) {
  //       return [];
  //     }
  //     const tempSlots: TimeSlot[] = utils.constructAllSlots({
  //       resource,
  //       from,
  //       to,
  //     });
  //     const bookings = await this.findBookings({
  //       from: new Date(
  //         from.getTime() - maxSlotDurationMinutes(resource.schedule) * 60 * 1000
  //       ),
  //       to,
  //       resourceIds: [resourceId],
  //       includeCanceled: false,
  //     });
  //     const slotsWithCorrectAvailability: TimeSlot[] = utils.reduceAvailability(
  //       tempSlots,
  //       bookings
  //     );
  //     return Promise.resolve(slotsWithCorrectAvailability);
  return [];
}

export default findAvailability;
