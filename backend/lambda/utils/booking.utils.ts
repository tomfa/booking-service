import { Booking, Resource } from '../../graphql/generated/types';

export const getBookingDurationMinutes = (booking: Booking): number =>
  (booking.end - booking.start) / 60;
export const bookingStartsInResourceSlot = (
  booking: Booking,
  resource: Resource
): boolean => {};
