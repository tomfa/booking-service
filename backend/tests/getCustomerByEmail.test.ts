import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { createCustomer } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

const getCustomerByEmailTest = async (email: string) => {
  const getCustomerByEmailQuery = gql`
    query  {
      getCustomerByEmail(email: "${email}") {
        id
        name
        email
        enabled
        phoneNumber
        credits
        issuer
      }
    }
  `;

  return query(getCustomerByEmailQuery);
};

describe('getCustomerByEmail', () => {
  it('returns customer', async () => {
    const customer = await createCustomer();
    const { data } = await getCustomerByEmailTest(customer.email);
    expect(data?.getCustomerByEmail).toEqual(objectContaining(customer));
  });
  it('returns null if not found', async () => {
    const { data } = await getCustomerByEmailTest('does-not-exist');
    expect(data.getCustomerByEmail).toEqual(null);
  });
});
