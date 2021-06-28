import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { toGQLDate } from '../lambda/utils/date.utils';
import { Booking, FindBookingInput } from '../graphql/generated/types';
import { createBooking, createCustomer, createResource } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

const createBookingForFiltering = async (
  date: Date,
  userId: string = 'tomfa'
): Promise<Booking> => {
  const customer = await createCustomer();
  const resource = await createResource({ customer });
  const bookingArgs = {
    start: toGQLDate(date),
    resourceId: resource.id,
    userId,
  };
  const { data } = await createBooking(bookingArgs);
  if (!data) {
    throw new Error();
  }
  return data.addBooking;
};

const getLatestBooking = async (filter: FindBookingInput = {}) => {
  const getLatestBookingQuery = gql`
    query GetBookedDurationQuery($filter: FindBookingInput!) {
      getLatestBooking(filterBookings: $filter) {
        id
        start
        end
        comment
        seatNumber
        userId
        canceled
        canceled
        resourceId
      }
    }
  `;

  const { data } = await query(getLatestBookingQuery, { filter });
  return data?.getLatestBooking;
};

describe('getLatestBooking', () => {
  it('returns the latest booking', async () => {
    const customer = await createCustomer();
    const resource = await createResource({ customer });
    const ten = toGQLDate(new Date('2021-06-21T10:00:00Z'));
    const eleven = toGQLDate(new Date('2021-06-21T11:00:00Z'));
    const twelve = toGQLDate(new Date('2021-06-21T12:00:00Z'));

    const {
      data: { addBooking: lateBooking },
    } = await createBooking({
      start: twelve,
      resourceId: resource.id,
      userId: 'tomfa',
    });
    const {
      data: { addBooking: earlyBooking },
    } = await createBooking({
      start: ten,
      resourceId: resource.id,
      userId: 'tomfa',
    });

    expect(await getLatestBooking()).toEqual(objectContaining(lateBooking));
    expect(await getLatestBooking({ to: eleven })).toEqual(
      objectContaining(earlyBooking)
    );
    expect(await getLatestBooking({ to: ten })).toEqual(null);
  });
  it('returns 0 if no bookings matches filter', async () => {
    const booking = await createBookingForFiltering(
      new Date('2021-06-21T10:00:00Z')
    );
    const latestBooking = await getLatestBooking({ userId: 'different-user' });
    expect(latestBooking).toEqual(null);
  });
});
