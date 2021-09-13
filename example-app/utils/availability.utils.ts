import { TimeSlot } from '../graphql/generated/types';
import { toGQLDate } from './date.utils';

export const findContinouslyAvailableSeats = ({
  slots,
  start,
  end,
}: {
  start: Date;
  end?: Date;
  slots?: TimeSlot[];
}): number[] => {
  if (!slots?.length || !end) {
    return [];
  }

  // TODO: Assuming that TimeSlots array spans at least the entire period,
  //  and includes all relevant slots with availableSlots = 0 if taken
  const startTime = toGQLDate(start);
  const endTime = toGQLDate(end);

  const applicableSlots = slots
    .filter(s => s.start >= startTime && s.end <= endTime)
    .sort((a, b) => a.start - b.start);

  const takenSlotExistsInPeriod = applicableSlots.find(
    s => s.availableSeats === 0
  );
  if (takenSlotExistsInPeriod) {
    return [];
  }

  const allAvailableSeats = slots.reduce(
    (availableSeats: number[] | undefined, slot) => {
      if (availableSeats === undefined) {
        return slot.seatsAvailable;
      }
      return availableSeats.filter(s => slot.seatsAvailable.includes(s));
    },
    undefined
  );

  return allAvailableSeats || [];
};
