import { gql } from 'apollo-boost';
import {
  AddBookingMutationVariables,
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
}: {
  id?: string;
  customer: Customer;
  enabled?: boolean;
  seats?: number;
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
                start: "08:00"
                end: "16:00"
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
  id: string = 'tomfa'
): Promise<Customer> => {
  const addCustomerInput = gql`
    mutation {
      addCustomer(addCustomerInput: { id: "${id}", email: "tomas@60401.work" }) {
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

  const { data } = await client.mutate<
    { addCustomer: Customer },
    AddCustomerMutationVariables
  >({
    mutation: addCustomerInput,
  });
  if (!data) {
    throw new Error(`Unable to create customer`);
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
