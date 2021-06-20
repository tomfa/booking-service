import { gql } from 'apollo-boost';
import {
  AddCustomerMutationVariables,
  Customer,
  Resource,
} from '../graphql/generated/types';
import { client, mutate } from './client';

export const createResource = async (customer: Customer): Promise<Resource> => {
  const resourceInput = gql`
      mutation {
        addResource(
          addResourceInput: {
            customerId: "${customer.id}",
            enabled: true
            label: "Chermics"
            seats: 20
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
  const { data } = await mutate(resourceInput);
  return data.addResource;
};

export const createCustomer = async (): Promise<Customer> => {
  const addCustomerInput = gql`
    mutation {
      addCustomer(addCustomerInput: { email: "tomas@60401.work" }) {
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
