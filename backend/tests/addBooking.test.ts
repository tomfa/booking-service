import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import {
  AddBookingMutationVariables,
  Booking,
} from '../graphql/generated/types';
import { client } from './client';
import { createCustomer, createResource } from './utils';
import objectContaining = jasmine.objectContaining;

describe('addBooking', () => {
  it('creates a booking', async () => {
    const customer = await createCustomer();
    const resource = await createResource(customer);
    const addBooking = gql`
      mutation {
        addBooking(addBookingInput: {
          resourceId: "${resource.id}"
          userId: "fish"
          start: 1624175061
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

    const { data } = await client.mutate<
      { addBooking: Booking },
      AddBookingMutationVariables
    >({
      mutation: addBooking,
    });
    expect(data?.addBooking).toEqual(
      objectContaining({
        canceled: false,
        comment: null,
        start: 1624175061,
        end: 1625975061,
        seatNumber: null,
        userId: 'fish',
        resourceId: resource.id,
        __typename: 'Booking',
      })
    );
  });
});
