import { Booking } from '../../graphql/generated/types';

export const getBookingDurationMinutes = (booking: Booking): number =>
  (booking.end - booking.start) / 60;
