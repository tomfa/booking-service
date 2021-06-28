import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { GetCustomerByIssuerQueryVariables } from '../graphql/generated/types';
import { createCustomer } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

const getCustomerByIssuerTest = async (
  variables: GetCustomerByIssuerQueryVariables
) => {
  const getCustomerByIssuerQuery = gql`
    query getCustomerByIssuerQuery($issuer: String!) {
      getCustomerByIssuer(issuer: $issuer) {
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

  return query(getCustomerByIssuerQuery, variables);
};

describe('getCustomerByIssuer', () => {
  it('returns customer', async () => {
    const issuer = 'henrik;';
    const customer = await createCustomer({
      id: 'fish',
      issuer,
      email: 'tomfa@github.io',
    });

    const { data } = await getCustomerByIssuerTest({ issuer });

    expect(data?.getCustomerByIssuer).toEqual(objectContaining(customer));
  });
  it('returns null if not found', async () => {
    await createCustomer({
      id: 'fish',
      issuer: 'henrik',
      email: 'tomfa@github.io',
    });

    const { data } = await getCustomerByIssuerTest({
      issuer: 'does-not-exist',
    });

    expect(data.getCustomerByIssuer).toEqual(null);
  });
});
