import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import {
  AddBookingMutationVariables,
  Booking,
  Customer,
  Resource,
} from '../graphql/generated/types';
import { toGQLDate } from '../lambda/utils/date.utils';
import { client } from './client';
import { createCustomer, createResource } from './utils';
import objectContaining = jasmine.objectContaining;

const addBooking = async ({
  start,
  resourceId,
  userId,
}: {
  start: number;
  resourceId: string;
  userId: string;
}) => {
  const bookingMutation = gql`
      mutation {
          addBooking(addBookingInput: {
              resourceId: "${resourceId}"
              userId: "${userId}"
              start: ${start}
          }) {
              id
              canceled
              comment
              start
              end
              seatNumber
              userId
              resourceId
          }
      }
  `;

  return client.mutate<{ addBooking: Booking }, AddBookingMutationVariables>({
    mutation: bookingMutation,
  });
};

describe('addBooking', () => {
  const resourceId = 'resource-1';
  const userId = 'user-1';
  const openTime = toGQLDate(new Date('2021-06-21T10:00:00Z'));
  const closedTime = toGQLDate(new Date('2021-06-20T10:00:00Z'));
  let customer: Customer;
  let resource: Resource;

  beforeEach(async () => {
    customer = await createCustomer();
    resource = await createResource(resourceId, customer);
  });

  it('creates a booking', async () => {
    const { data } = await addBooking({ start: openTime, resourceId, userId });

    expect(data?.addBooking).toEqual(
      objectContaining({
        canceled: false,
        comment: null,
        start: openTime,
        end: openTime + 30 * 60,
        seatNumber: 0,
        resourceId,
        userId,
        __typename: 'Booking',
      })
    );
  });
  it('fails if start is outside resource opening hours', async () => {
    const { data, errors } = await addBooking({
      start: closedTime,
      resourceId,
      userId,
    });
    expect(data?.addBooking).toBe(null);
    expect(errors?.length).toBe(1);
    expect(errors[0].message).toBe(
      `Unable to add booking: resource ${resourceId} is closed`
    );
    expect(errors[0].extensions).toEqual({
      code: 400,
      type: 'booking_slot_is_not_available',
    });
  });
  it('fails if start does not align with schedule', async () => {
    const invalidTime = openTime - 1;
    const { data, errors } = await addBooking({
      start: invalidTime,
      resourceId,
      userId,
    });
    expect(data?.addBooking).toBe(null);
    expect(errors?.length).toBe(1);
    if (!errors) {
      return;
    }
    expect(errors[0].message).toBe(
      `Booked time ${invalidTime} does not fit into resource ${resourceId} time slots`
    );
    expect(errors[0].extensions).toEqual({
      code: 400,
      type: 'booking_slot_is_not_available',
    });
  });
});
