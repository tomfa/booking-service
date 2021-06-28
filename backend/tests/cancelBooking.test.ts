import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { Customer, Resource } from '../graphql/generated/types';
import { toGQLDate } from '../lambda/utils/date.utils';
import { createBooking, createCustomer, createResource } from './utils';
import { mutate } from './client';
import objectContaining = jasmine.objectContaining;

describe('cancelBooking', () => {
  const resourceId = 'resource-1';
  const userId = 'user-1';
  const openTime = toGQLDate(new Date('2021-06-21T10:00:00Z'));
  let customer: Customer;
  let resource: Resource;

  beforeEach(async () => {
    customer = await createCustomer();
    resource = await createResource({ id: resourceId, customer });
  });

  it('changes canceled to true', async () => {
    const { data: response } = await createBooking({
      start: openTime,
      resourceId,
      userId,
    });
    const id = response?.addBooking.id;

    const bookingMutation = gql`
        mutation {
            cancelBooking(id: "${id}") {
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

    const { data } = await mutate(bookingMutation);
    expect(data?.cancelBooking).toEqual(
      objectContaining({ id, canceled: true })
    );
  });
  it('throws an error if booking does not exist', async () => {
    const bookingMutation = gql`
      mutation {
        cancelBooking(id: "does-not-exist") {
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

    const { errors } = await mutate(bookingMutation);
    expect(errors?.length).toBe(1);
  });
});
