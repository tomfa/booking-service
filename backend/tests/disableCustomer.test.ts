import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { createCustomer } from './utils';
import { mutate } from './client';
import objectContaining = jasmine.objectContaining;

describe('disableCustoemr', () => {
  it('changes enabled to false', async () => {
    const customer = await createCustomer();
    const disableCustomer = gql`
        mutation {
            disableCustomer(id: "${customer.id}") {
                id
                email
                enabled
            }
        }
    `;

    const { data } = await mutate(disableCustomer);
    expect(data?.disableCustomer).toEqual(
      objectContaining({ id: customer.id, enabled: false })
    );
  });
});
