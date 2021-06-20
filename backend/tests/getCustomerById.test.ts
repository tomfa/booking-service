import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { createCustomer } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

const getCustomerByIdTest = async (id: string) => {
  const getCustomerByIdQuery = gql`
    query  {
      getCustomerById(id: "${id}") {
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

  return query(getCustomerByIdQuery);
};

describe('getCustomerById', () => {
  it('returns customer', async () => {
    const customer = await createCustomer();
    const { data } = await getCustomerByIdTest(customer.id);
    expect(data?.getCustomerById).toEqual(objectContaining(customer));
  });
  it('returns null if not found', async () => {
    const { data } = await getCustomerByIdTest('does-not-exist');
    expect(data.getCustomerById).toEqual(null);
  });
});
