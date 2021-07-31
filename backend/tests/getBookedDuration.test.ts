import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { toGQLDate } from '../lambda/utils/date.utils';
import { Booking, FindBookingInput } from '../graphql/generated/types';
import { getBookingDurationMinutes } from '../lambda/utils/booking.utils';
import { createBooking, createCustomer, createResource } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

const createBookingForFiltering = async (
  userId: string = 'tomfa'
): Promise<Booking> => {
  const customer = await createCustomer();
  const resource = await createResource({ customer });
  const bookingArgs = {
    start: toGQLDate(new Date('2021-06-21T10:00:00Z')),
    resourceId: resource.id,
    userId,
  };
  const { data } = await createBooking(bookingArgs);
  if (!data?.addBooking) {
    throw new Error();
  }
  return data.addBooking;
};

const getBookedDuration = async (filter: FindBookingInput = {}) => {
  const getBookedDurationQuery = gql`
    query GetBookedDurationQuery($filter: FindBookingInput!) {
      getBookedDuration(filterBookings: $filter) {
        minutes
        numBookings
        bookingIds
      }
    }
  `;

  const { data } = await query(getBookedDurationQuery, { filter });
  const bookings = data?.getBookedDuration;
  if (!bookings) {
    throw new Error();
  }
  return bookings;
};

describe('getBookedDuration', () => {
  it('returns booked duration', async () => {
    const booking = await createBookingForFiltering();
    const duration = await getBookedDuration();
    expect(duration).toEqual({
      __typename: 'BookedDuration',
      bookingIds: [booking.id],
      minutes: getBookingDurationMinutes(booking),
      numBookings: 1,
    });
  });
  it('returns 0 minutes if no bookings matches filter', async () => {
    const booking = await createBookingForFiltering();
    const duration = await getBookedDuration({ userId: 'different-user' });
    expect(duration).toEqual({
      __typename: 'BookedDuration',
      bookingIds: [],
      minutes: 0,
      numBookings: 0,
    });
  });
});
