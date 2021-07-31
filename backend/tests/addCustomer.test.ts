import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { mutate } from './client';
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

    const { data } = await mutate(addCustomerInput);
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
    await mutate(firstMutation);
    const { errors } = await mutate(firstMutation);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(
      'Customer already exists with same values for fields: email'
    );
    expect(errors[0].extensions).toEqual({
      code: 400,
      type: 'conflicts_with_existing_resource',
    });
  });
});
