import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { createCustomer, createResource } from './utils';
import { mutate } from './client';
import objectContaining = jasmine.objectContaining;

describe('disableResource', () => {
  it('changes enabled to false', async () => {
    const customer = await createCustomer();
    const resource = await createResource({ customer });
    const disableResource = gql`
        mutation {
            disableResource(id: "${resource.id}") {
                id
                enabled
            }
        }
    `;

    const { data } = await mutate(disableResource);
    expect(data?.disableResource).toEqual(
      objectContaining({ id: resource.id, enabled: false })
    );
  });
});
