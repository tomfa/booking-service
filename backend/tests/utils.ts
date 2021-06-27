import { gql } from 'apollo-boost';
import {
  AddBookingMutationVariables,
  AddCustomerInput,
  AddCustomerMutationVariables,
  Booking,
  Customer,
  Resource,
} from '../graphql/generated/types';
import { client, mutate } from './client';

export const createResource = async ({
  id = 'anything',
  customer,
  enabled = true,
  seats = 20,
  start = '08:00',
  end = '16:00',
}: {
  id?: string;
  customer: Customer;
  enabled?: boolean;
  seats?: number;
  start?: string;
  end?: string;
}): Promise<Resource> => {
  const resourceInput = gql`
      mutation {
        addResource(
          addResourceInput: {
            id: "${id}"
            customerId: "${customer.id}",
            enabled: ${enabled}
            label: "Chermics"
            seats: ${seats}
            schedule: [
              {
                slotDurationMinutes: 30
                slotIntervalMinutes: 15
                day: "mon"
                start: "${start}"
                end: "${end}"
              }
            ]
          }
        ) {
          id
          label
          seats
          schedule {
              mon {
                  start
                  end
                  slotDurationMinutes
                  slotIntervalMinutes
              }
              tue {
                  start
                  end
                  slotDurationMinutes
                  slotIntervalMinutes
              }
              
              overriddenDates {
                  isoDate
                  schedule {
                      slotDurationMinutes
                      slotIntervalMinutes
                      start
                      end
                  }
              }
          }
          enabled
          category
        }
      }
    `;
  const { data, errors } = await mutate(resourceInput);
  if (errors) {
    console.log('createResource errors', JSON.stringify(errors));
  }
  return data.addResource;
};

export const createCustomer = async (
  addCustomerInput: AddCustomerInput = {
    id: 'testUser',
    email: 'tomas@60401.work',
  }
): Promise<Customer> => {
  const addCustomerInputMutation = gql`
    mutation AddCustomerMutation($addCustomerInput: AddCustomerInput!) {
      addCustomer(addCustomerInput: $addCustomerInput) {
        id
        phoneNumber
        name
        enabled
        email
        credits
        issuer
      }
    }
  `;

  const { data, errors } = await client.mutate<
    { addCustomer: Customer },
    AddCustomerMutationVariables
  >({
    mutation: addCustomerInputMutation,
    variables: {
      addCustomerInput,
    },
  });
  if (!data?.addCustomer) {
    throw new Error(`Unable to create customer: ${JSON.stringify(errors)}`);
  }
  return data.addCustomer;
};

export const createBooking = async ({
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
