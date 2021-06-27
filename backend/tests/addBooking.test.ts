/* eslint-disable @typescript-eslint/no-shadow */

import { FetchResult, gql } from 'apollo-boost';
import 'cross-fetch/polyfill';
import { Booking, Customer, Resource } from '../graphql/generated/types';
import { toGQLDate } from '../lambda/utils/date.utils';
import { createBooking, createCustomer, createResource } from './utils';
import { mutate } from './client';
import objectContaining = jasmine.objectContaining;

describe('addBooking', () => {
  const resourceId = 'resource-1';
  const userId = 'user-1';
  const openTime = toGQLDate(new Date('2021-06-21T10:00:00Z'));
  const closedTime = toGQLDate(new Date('2021-06-20T10:00:00Z'));
  let customer: Customer;
  let resource: Resource;

  describe('when successfully creating a booking', () => {
    let firstBooking: FetchResult<{ addBooking: Booking }>;
    let secondBooking: FetchResult<{ addBooking: Booking }>;
    beforeAll(async () => {
      customer = await createCustomer();
      resource = await createResource({ id: resourceId, customer });
      firstBooking = await createBooking({
        start: openTime,
        resourceId,
        userId,
      });
      secondBooking = await createBooking({
        start: openTime,
        resourceId,
        userId,
      });
    });
    it('returns a booking', () => {
      expect(firstBooking.data?.addBooking).toEqual(
        objectContaining({
          canceled: false,
          comment: null,
          start: openTime,
          end: openTime + 30 * 60,
          seatNumber: 0,
          resourceId,
          userId,
          __typename: 'Booking',
        })
      );
    });
    it('increments seatNumber', () => {
      expect(firstBooking.data?.addBooking.seatNumber).toBe(0);
      expect(secondBooking.data?.addBooking.seatNumber).toBe(1);
    });
    it('sets canceled = false', () => {
      expect(firstBooking.data?.addBooking.canceled).toBe(false);
    });
    it('sets end to equal start + resource slotDuration', async () => {
      expect(firstBooking.data?.addBooking.end).toEqual(
        openTime + resource.schedule.mon.slotDurationMinutes * 60
      );
    });
  });
  it('returns error if resourceId is unknown', async () => {
    const { errors } = await createBooking({
      start: openTime,
      resourceId: 'resource-unknown',
      userId,
    });
    expect(errors?.length).toBe(1);
    const error = errors && errors[0];

    expect(error?.message).toEqual(
      'Can not create booking on unknown resource'
    );
    expect(error?.extensions).toEqual({
      code: 400,
      type: 'resource_does_not_exist',
    });
  });
  it('returns error if resourceId is not enabled', async () => {
    customer = await createCustomer();
    resource = await createResource({ customer });
    const { errors } = await createBooking({
      start: openTime,
      resourceId: 'resource-unknown',
      userId,
    });
    expect(errors?.length).toBe(1);
    const error = errors && errors[0];

    expect(error?.message).toEqual(
      'Can not create booking on unknown resource'
    );
    expect(error?.extensions).toEqual({
      code: 400,
      type: 'resource_does_not_exist',
    });
  });
  it('fails if start is outside resource opening hours', async () => {
    const customer = await createCustomer();
    const disabledResource = await createResource({
      id: resourceId,
      customer,
      enabled: false,
    });
    const { data, errors } = await createBooking({
      start: closedTime,
      resourceId: disabledResource.id,
      userId,
    });
    expect(data?.addBooking).toBe(null);
    expect(errors?.length).toBe(1);
    expect(errors[0].message).toBe(
      `Unable to add booking to disabled resource ${resourceId}`
    );
    expect(errors[0].extensions).toEqual({
      code: 400,
      type: 'resource_is_disabled',
    });
  });
  it('fails if no slots left', async () => {
    const customer = await createCustomer();
    const resourceWithOneSeat = await createResource({
      id: resourceId,
      customer,
      seats: 1,
    });

    await createBooking({ start: openTime, resourceId, userId });
    const { errors } = await createBooking({
      start: openTime,
      resourceId: resourceWithOneSeat.id,
      userId,
    });
    expect(errors?.length).toBe(1);
    if (!errors) {
      return;
    }
    expect(errors[0].message).toBe(
      `No available slots in requested period for resource ${resourceId}`
    );
    expect(errors[0].extensions).toEqual({
      code: 400,
      type: 'booking_slot_is_not_available',
    });
  });
  it('reuses seats for canceled bookings', async () => {
    const customer = await createCustomer();
    const resourceWithOneSeat = await createResource({
      id: resourceId,
      customer,
      seats: 1,
    });

    const { data: first } = await createBooking({
      start: openTime,
      resourceId: resourceWithOneSeat.id,
      userId,
    });
    await mutate(
      gql`mutation {cancelBooking(id: "${first?.addBooking.id}") {id}}`
    );
    const { data: second, errors } = await createBooking({
      start: openTime,
      resourceId: resourceWithOneSeat.id,
      userId,
    });

    expect(errors).toBe(undefined);
    expect(first?.addBooking.seatNumber).toBe(0);
    expect(second?.addBooking.seatNumber).toBe(0);
  });
  it('fails if start does not align with schedule', async () => {
    const invalidTime = openTime - 1;
    customer = await createCustomer();
    resource = await createResource({ id: resourceId, customer });
    const { data, errors } = await createBooking({
      start: invalidTime,
      resourceId,
      userId,
    });
    expect(data?.addBooking).toBe(null);
    expect(errors?.length).toBe(1);
    if (!errors) {
      return;
    }
    expect(errors[0].message).toBe(
      `Booked time ${invalidTime} does not fit into resource ${resourceId} time slots`
    );
    expect(errors[0].extensions).toEqual({
      code: 400,
      type: 'booking_slot_is_not_available',
    });
  });
});
