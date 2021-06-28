import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { createResource, createCustomer } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

const getResourceByIdTest = async (id: string) => {
  const getResourceByIdQuery = gql`
    query  {
      getResourceById(id: "${id}") {
        id
        label
        category
        enabled
      }
    }
  `;

  return query(getResourceByIdQuery);
};

describe('getResourceById', () => {
  it('returns resource', async () => {
    const customer = await createCustomer();
    const resource = await createResource({ customer });
    const { data } = await getResourceByIdTest(resource.id);
    expect(data?.getResourceById).toEqual(
      objectContaining({
        id: resource.id,
        label: resource.label,
        category: resource.category,
        enabled: resource.enabled,
      })
    );
  });
  it('returns null if not found', async () => {
    const { data } = await getResourceByIdTest('does-not-exist');
    expect(data.getResourceById).toEqual(null);
  });
});
