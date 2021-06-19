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
          issuer
          credits
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
      })
    );
    expect(data?.addCustomer.id).toBeTruthy();
  });
  it('returns an error if email is already taken', async () => {
    const firstMutation = gql`
      mutation {
        addCustomer(addCustomerInput: { email: "tomas@6040.work" }) {
          id
        }
      }
    `;
    await client.mutate({ mutation: firstMutation });
    const { errors } = await client.mutate({ mutation: firstMutation });
    console.log(errors);
    expect(errors).toEqual({})
  });
  it('returns an error if issuer is already taken', async () => {});
  it('returns an error if id is already taken', async () => {});
});
