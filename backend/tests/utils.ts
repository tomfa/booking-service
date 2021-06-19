import { gql } from 'apollo-boost';
import {
  AddCustomerMutationVariables,
  Customer,
} from '../graphql/generated/types';
import { client } from './client';

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
