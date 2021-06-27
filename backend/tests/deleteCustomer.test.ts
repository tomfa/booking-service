import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { toGQLDate } from '../lambda/utils/date.utils';
import { getDB } from '../localDb';
import { createBooking, createCustomer, createResource } from './utils';
import { mutate } from './client';
import objectContaining = jasmine.objectContaining;

const countDbStuff = async () => {
  const db = await getDB();
  const customers = await db.customer.findMany();
  const resources = await db.resource.findMany();
  const bookings = await db.booking.findMany();
  return {
    customers: customers.length,
    resources: resources.length,
    bookings: bookings.length,
  };
};

describe('deleteCustomer', () => {
  it('deletes customer and related bookings and resources', async () => {
    const customer = await createCustomer();
    const resource = await createResource({ customer });
    await createBooking({
      start: toGQLDate(new Date('2021-06-21T10:00:00Z')),
      resourceId: resource.id,
      userId: 'asdasd',
    });
    const beforeCount = await countDbStuff();
    expect(beforeCount.customers).toBe(1);
    expect(beforeCount.resources).toBe(1);
    expect(beforeCount.bookings).toBe(1);

    const deleteCustomer = gql`
        mutation {
            deleteCustomer(id: "${customer.id}") {
                id
                email
                enabled
            }
        }
    `;

    const { data, errors } = await mutate(deleteCustomer);
    const afterCount = await countDbStuff();
    expect(afterCount.customers).toBe(0);
    expect(afterCount.resources).toBe(0);
    expect(afterCount.bookings).toBe(0);
    expect(data?.deleteCustomer).toEqual(objectContaining({ id: customer.id }));
  });
});
