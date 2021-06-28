import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { UpdateResourceInput } from '../graphql/generated/types';
import { mutate } from './client';
import { createCustomer, createResource } from './utils';
import objectContaining = jasmine.objectContaining;

describe('updateResource', () => {
  it('updates an existing Resource', async () => {
    const customer = await createCustomer();
    const resource = await createResource({ customer });
    const updateResourceInputMutation = gql`
      mutation UpdateResourceMutation(
        $updateResourceInput: UpdateResourceInput!
      ) {
        updateResource(updateResourceInput: $updateResourceInput) {
          id
          enabled
          seats
          label
          category
        }
      }
    `;
    const updateResourceInput: UpdateResourceInput = {
      id: resource.id,
      category: 'fish',
      seats: 10,
      label: 'Fish stove',
    };
    const { data } = await mutate(updateResourceInputMutation, {
      updateResourceInput,
    });
    expect(data?.updateResource).toEqual(objectContaining(updateResourceInput));
  });
  it('returns error if resource is not found', async () => {
    const updateResourceInputMutation = gql`
      mutation UpdateResourceMutation(
        $updateResourceInput: UpdateResourceInput!
      ) {
        updateResource(updateResourceInput: $updateResourceInput) {
          id
          enabled
          seats
          label
          category
        }
      }
    `;
    const updateResourceInput: UpdateResourceInput = {
      id: 'non-existing',
      category: 'fish',
      seats: 10,
      label: 'Fish stove',
    };
    const { data, errors } = await mutate(updateResourceInputMutation, {
      updateResourceInput,
    });
    expect(data?.updateResource).toEqual(null);
    expect(errors[0].message).toBe(
      `Resource with id ${updateResourceInput.id} not found`
    );
  });
});
