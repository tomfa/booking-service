import { Booking, TimeSlot } from '../../graphql/generated/types';
import { IsoDate } from './types';

export const fromGQLDate = (seconds: number): Date => new Date(seconds * 1000);
export const toGQLDate = (date: Date): number =>
  Math.floor(date.getTime() / 1000);
export const getIsoDate = (date: Date): IsoDate => {
  return date.toISOString().substr(0, 10);
};
export const splitHourMinuteOfDay = (
  date: Date
): { hour: number; minute: number } => {
  return { hour: date.getUTCHours(), minute: date.getUTCMinutes() };
};
export const msOfDay = (date: Date): number => {
  return (
    date.getUTCHours() * 3600 * 1000 +
    date.getUTCMinutes() * 60 * 1000 +
    date.getUTCSeconds() * 1000 +
    date.getUTCMilliseconds()
  );
};
export const reduceAvailability = (
  tempSlots: TimeSlot[],
  bookings: Booking[]
): TimeSlot[] => {
  let updatedSlots = tempSlots.slice();
  bookings.forEach(booking => {
    // TODO: inefficient
    updatedSlots = updatedSlots.map(slot => {
      const overlaps = slot.start < booking.end && slot.end > booking.start;
      if (overlaps) {
        return { ...slot, availableSeats: slot.availableSeats - 1 };
      }
      return slot;
    });
  });
  return updatedSlots;
};
export const getDiffInMinutes = (start: Date, end: Date): number => {
  const milliDiff = Math.abs(end.getTime() - start.getTime());
  return Math.floor(milliDiff / (60 * 1000));
};
export const addMinutes = (date: Date, numMinutes: number): Date => {
  return new Date(date.getTime() + numMinutes * 60 * 1000);
};
export const isValidDate = (date: Date): boolean =>
  !Number.isNaN(date.getTime());
