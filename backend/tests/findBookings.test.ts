import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { toGQLDate } from '../lambda/utils/date.utils';
import { Booking, FindBookingInput } from '../graphql/generated/types';
import { createBooking, createCustomer, createResource } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

const createBookingForFiltering = async (): Promise<Booking> => {
  const userId = 'tomfa';
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

const findBookings = async (filter: FindBookingInput = {}) => {
  const findBookingsQuery = gql`
    query FindBookingQuery($filter: FindBookingInput!) {
      findBookings(filterBookings: $filter) {
        id
        start
        end
        userId
        resourceId
      }
    }
  `;

  const { data } = await query(findBookingsQuery, { filter });
  const bookings = data?.findBookings;
  if (!bookings) {
    throw new Error();
  }
  return bookings;
};

describe('findBookings', () => {
  it('returns bookings', async () => {
    const booking = await createBookingForFiltering();
    const bookings = await findBookings();
    if (!bookings) {
      throw new Error();
    }
    expect(bookings.length).toBe(1);
    const firstBooking = bookings[0];
    expect(firstBooking).toEqual(
      objectContaining({
        userId: booking.userId,
        id: booking.id,
      })
    );
  });
  it('can be filtered by userId', async () => {
    const booking = await createBookingForFiltering();
    const noResult = await findBookings({ userId: 'different' });
    expect(noResult.length).toBe(0);
    const result = await findBookings({ userId: booking.userId });
    expect(result.length).toBe(1);
  });
  it('can be filtered by resourceId', async () => {
    const booking = await createBookingForFiltering();
    const noResult = await findBookings({ resourceIds: ['different'] });
    expect(noResult.length).toBe(0);
    const result = await findBookings({ resourceIds: [booking.resourceId] });
    expect(result.length).toBe(1);
  });
  it('can be filtered by userId', async () => {
    await createBookingForFiltering();
    const bookings = await findBookings({ userId: 'different' });
    expect(bookings.length).toBe(0);
  });
  it('does not return bookings that started before filter, but ends within', async () => {
    const booking = await createBookingForFiltering();
    const bookings = await findBookings({
      from: booking.start + 1,
    });
    expect(bookings.length).toBe(0);
  });
  it('returns bookings that started within filter, but ends after', async () => {
    const booking = await createBookingForFiltering();
    const bookings = await findBookings({
      to: booking.end - 1,
    });
    expect(bookings.length).toBe(1);
  });
});
