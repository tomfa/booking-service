import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import {
  AddCustomerMutationVariables,
  Customer,
} from '../graphql/generated/types';
// import { getDB } from '../localDb';
import { client } from './client';
import objectContaining = jasmine.objectContaining;

describe('addCustomer', () => {
  it('creates a new Customer', async () => {
    const addCustomerInput = gql`
      mutation {
        addCustomer(addCustomerInput: { email: "tomas@6040.work" }) {
          id
          phoneNumber
          name
          enabled
          email
        }
      }
    `;

    const { data } = await client.mutate<
      { addCustomer: Customer },
      AddCustomerMutationVariables
    >({
      mutation: addCustomerInput,
    });
    expect(data?.addCustomer).toEqual(
      objectContaining({
        __typename: 'Customer',
        email: 'tomas@6040.work',
        enabled: true,
        name: null,
        phoneNumber: null,
      })
    );
    expect(data?.addCustomer.id).toBeTruthy();
  });
});
