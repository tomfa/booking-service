import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import { fromGQLDate, toGQLDate } from '../lambda/utils/date.utils';
import { getDB } from '../localDb';
import { TimeSlot } from '../graphql/generated/types';
import { createCustomer, createResource } from './utils';
import { query } from './client';
import objectContaining = jasmine.objectContaining;

describe('findAvailability', () => {
  it('returns available slots', async () => {
    const customer = await createCustomer();
    const resource = await createResource({ customer });
    const from = new Date('2021-06-21');
    const to = new Date('2021-06-22');
    const findAvailability = gql`
      query {
        findAvailability(filterAvailability: {
          resourceIds: ["${resource.id}"]
          from: ${toGQLDate(from)}
          to: ${toGQLDate(to)}
        }) {
          start
          end
          availableSeats
        }
      }
    `;

    const { data } = await query(findAvailability);
    const slots = data?.findAvailability;
    if (!slots) {
      throw new Error();
    }
    expect(slots.length).toBe(31); // 8 hours open: 4 for first 7 hours + 3 for last hour
    const firstSlot = slots[0];
    expect(fromGQLDate(firstSlot?.start).toISOString()).toBe(
      '2021-06-21T08:00:00.000Z'
    );
    expect(fromGQLDate(firstSlot?.end).toISOString()).toBe(
      '2021-06-21T08:30:00.000Z'
    );
    expect(firstSlot.availableSeats).toBe(20);
    const lastSlot = slots[slots.length - 1];
    expect(fromGQLDate(lastSlot?.start).toISOString()).toBe(
      '2021-06-21T15:30:00.000Z'
    );
    expect(fromGQLDate(lastSlot?.end).toISOString()).toBe(
      '2021-06-21T16:00:00.000Z'
    );
    expect(lastSlot.availableSeats).toBe(20);
  });
  it('reduces availability based on non-canceled bookings in time period', async () => {
    const customer = await createCustomer();
    const resource = await createResource({
      id: 'singleseat',
      customer,
      seats: 1,
    });
    const from = new Date('2021-06-21');
    const to = new Date('2021-06-22');
    const db = await getDB();
    await db.booking.create({
      data: {
        customerId: customer.id || null,
        resourceId: resource.id,
        userId: 'not-relevant',
        startTime: new Date('2021-06-21T07:00:00Z'),
        endTime: new Date('2021-06-21T09:30:00Z'),
        comment: null,
        canceled: false,
        seatNumber: 0,
        id: 'asdasdasd123',
      },
    });
    const findAvailability = gql`
      query {
        findAvailability(filterAvailability: {
          resourceIds: ["${resource.id}"]
          from: ${toGQLDate(from)}
          to: ${toGQLDate(to)}
        }) {
          start
          end
          availableSeats
        }
      }
    `;

    const { data } = await query(findAvailability);
    const slots = data?.findAvailability;
    if (!slots) {
      throw new Error();
    }
    expect(slots.length).toBe(31);
    const firstSlot: TimeSlot = slots[0];
    const firstAvailableSlot: TimeSlot = slots.find(s => s.availableSeats > 0);
    expect(fromGQLDate(firstSlot?.start).toISOString()).toBe(
      '2021-06-21T08:00:00.000Z'
    );
    expect(fromGQLDate(firstSlot?.end).toISOString()).toBe(
      '2021-06-21T08:30:00.000Z'
    );
    expect(firstSlot.availableSeats).toBe(0);
    expect(fromGQLDate(firstAvailableSlot?.start).toISOString()).toBe(
      '2021-06-21T09:30:00.000Z'
    );
    expect(fromGQLDate(firstAvailableSlot?.end).toISOString()).toBe(
      '2021-06-21T10:00:00.000Z'
    );
    expect(firstAvailableSlot.availableSeats).toBe(1);
  });
  it.skip('supports finding slots for multiple resource at once', async () => {
    // TODO: Implement this
    const customer = await createCustomer();
    const resource = await createResource({ customer });
    const otherResource = await createResource({
      customer,
      id: 'other-resource',
    });
    const from = new Date('2021-06-21');
    const to = new Date('2021-06-22');
    const findAvailability = gql`
        query {
            findAvailability(filterAvailability: {
                resourceIds: ["${resource.id}", "${otherResource.id}"]
                from: ${toGQLDate(from)}
                to: ${toGQLDate(to)}
            }) {
                start
                end
                availableSeats
            }
        }
    `;

    const { data } = await query(findAvailability);
    const slots = data?.findAvailability;
    if (!slots) {
      throw new Error();
    }
    expect(slots.length).toBe(31); // 8 hours open: 4 for first 7 hours + 3 for last hour
    const firstSlot = slots[0];
    expect(fromGQLDate(firstSlot?.start).toISOString()).toBe(
      '2021-06-21T08:00:00.000Z'
    );
    expect(fromGQLDate(firstSlot?.end).toISOString()).toBe(
      '2021-06-21T08:30:00.000Z'
    );
    const lastSlot = slots[slots.length - 1];
    expect(fromGQLDate(lastSlot?.start).toISOString()).toBe(
      '2021-06-21T15:30:00.000Z'
    );
    expect(fromGQLDate(lastSlot?.end).toISOString()).toBe(
      '2021-06-21T16:00:00.000Z'
    );
  });
});
