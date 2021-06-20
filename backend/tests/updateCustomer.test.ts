import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { UpdateCustomerInput } from '../graphql/generated/types';
import { mutate } from './client';
import { createCustomer } from './utils';
import objectContaining = jasmine.objectContaining;

describe('updateCustomer', () => {
  it('updates an existing Customer', async () => {
    const customer = await createCustomer();
    const updateCustomerInputMutation = gql`
      mutation AddCustomerMutation($updateCustomerInput: UpdateCustomerInput!) {
        updateCustomer(updateCustomerInput: $updateCustomerInput) {
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
    const updateCustomerInput: UpdateCustomerInput = {
      id: customer.id,
      issuer: 'cakebuisqites.com',
      credits: 1000,
      phoneNumber: '+4741767679',
    };
    const { data } = await mutate(updateCustomerInputMutation, {
      updateCustomerInput,
    });
    expect(data?.updateCustomer).toEqual(objectContaining(updateCustomerInput));
  });
  it('returns error if customer is not found', async () => {
    const updateCustomerInputMutation = gql`
      mutation AddCustomerMutation($updateCustomerInput: UpdateCustomerInput!) {
        updateCustomer(updateCustomerInput: $updateCustomerInput) {
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
    const updateCustomerInput: UpdateCustomerInput = {
      id: 'nope',
      issuer: 'cakebuisqites.com',
      credits: 1000,
      phoneNumber: '+4741767679',
    };
    const { data, errors } = await mutate(updateCustomerInputMutation, {
      updateCustomerInput,
    });
    expect(data?.updateCustomer).toEqual(null);
    expect(errors[0].message).toBe(
      `Customer with id ${updateCustomerInput.id} not found`
    );
  });
});
