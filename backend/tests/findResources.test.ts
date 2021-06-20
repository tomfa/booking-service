import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { FindResourceInput, Resource } from '../graphql/generated/types';
import { createCustomer, createResource } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

const createResourceForFiltering = async (): Promise<Resource> => {
  const customer = await createCustomer('tomfa');
  return await createResource({ customer });
};

const findResources = async (filter: FindResourceInput = {}) => {
  const findResourcesQuery = gql`
    query FindResourceQuery($filter: FindResourceInput!) {
      findResources(filterResource: $filter) {
        id
        category
        label
        enabled
      }
    }
  `;

  const { data } = await query(findResourcesQuery, { filter });
  const resources = data?.findResources;
  if (!resources) {
    throw new Error();
  }
  return resources;
};

describe('findResources', () => {
  it('returns resources', async () => {
    const resource = await createResourceForFiltering();
    const resources = await findResources();
    expect(resources.length).toBe(1);
    const firstResource = resources[0];
    expect(firstResource).toEqual(
      objectContaining({
        id: resource.id,
      })
    );
  });
  it('can be filtered by enabled', async () => {
    const resource = await createResourceForFiltering();
    const noResult = await findResources({ enabled: false });
    expect(noResult.length).toBe(0);
    const result = await findResources({ enabled: true });
    expect(result.length).toBe(1);
  });
  it('can be filtered by resourceId', async () => {
    const resource = await createResourceForFiltering();
    const noResult = await findResources({ resourceIds: ['different'] });
    expect(noResult.length).toBe(0);
    const result = await findResources({ resourceIds: [resource.id] });
    expect(result.length).toBe(1);
  });
  it('can be filtered by customerId', async () => {
    const resource = await createResourceForFiltering();
    const noResult = await findResources({ customerId: 'different' });
    expect(noResult.length).toBe(0);
    const result = await findResources({ customerId: 'tomfa' });
    expect(result.length).toBe(1);
  });
  it('can be filtered by label', async () => {
    const resource = await createResourceForFiltering();
    const noResult = await findResources({ label: 'different' });
    expect(noResult.length).toBe(0);
    const result = await findResources({ label: resource.label });
    expect(result.length).toBe(1);
  });
});
