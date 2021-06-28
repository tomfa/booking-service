import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { toGQLDate } from '../lambda/utils/date.utils';
import { Booking } from '../graphql/generated/types';
import { createBooking, createCustomer, createResource } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

const createBookingForTest = async (
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

const getBookingByIdTest = async (id: string) => {
  const getBookingByIdQuery = gql`
    query  {
      getBookingById(id: "${id}") {
        id
        start
        end
        canceled
        resourceId
        canceled
        comment
        userId
        seatNumber
      }
    }
  `;

  return query(getBookingByIdQuery);
};

describe('getBookingById', () => {
  it('returns booking', async () => {
    const booking = await createBookingForTest();
    const { data } = await getBookingByIdTest(booking.id);
    expect(data?.getBookingById).toEqual(objectContaining(booking));
  });
  it('returns null if not found', async () => {
    const { data } = await getBookingByIdTest('does-not-exist');
    expect(data.getBookingById).toEqual(null);
  });
});
