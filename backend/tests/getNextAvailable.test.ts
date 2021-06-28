import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { fromGQLDate, toGQLDate } from '../lambda/utils/date.utils';
import { createCustomer, createResource } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

describe('getNextAvailable', () => {
  it('returns first available slot', async () => {
    const customer = await createCustomer();
    const resource = await createResource({ customer, seats: 1 });
    const from = toGQLDate(new Date('2021-06-21'));

    const getNextAvailable = gql`
      query {
        getNextAvailable(id: "${resource.id}", afterDate: ${from}) {
          start
          end
          availableSeats
        }
      }
    `;

    const { data } = await query(getNextAvailable);
    const slot = data?.getNextAvailable;
    expect(fromGQLDate(slot?.start).toISOString()).toBe(
      '2021-06-21T08:00:00.000Z'
    );
    expect(fromGQLDate(slot?.end).toISOString()).toBe(
      '2021-06-21T08:30:00.000Z'
    );
  });
  it('returns null for closed resource', async () => {
    const customer = await createCustomer();
    const resource = await createResource({
      customer,
      enabled: false,
      id: 'fishsticks',
    });
    const from = toGQLDate(new Date('2021-06-21'));

    const getNextAvailable = gql`
      query {
        getNextAvailable(id: "${resource.id}", afterDate: ${from}) {
          start
          end
          availableSeats
        }
      }
    `;

    const { data, errors } = await query(getNextAvailable);
    expect(data?.getNextAvailable).toBe(null);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(
      'Unable to find enabled resources with ids: fishsticks'
    );
  });
});
