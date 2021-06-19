import { TimeSlot } from '../../graphql/generated/types';

async function getNextAvailable(id: string): Promise<TimeSlot> {
  // TODO
  // const availableSlots = await this.findAvailability({
  //       resourceId,
  //       from: after,
  //     });
  //     if (!availableSlots.length) {
  //       return undefined;
  //     }
  //     // TODO: Only luck that it is ordered by time
  //     const slotClosestInTime = availableSlots.find(
  //       slot => slot.availableSeats >= 1
  //     );
  //
  return {
    availableSeats: 0,
    start: 0,
    end: 0,
  };
}

export default getNextAvailable;
