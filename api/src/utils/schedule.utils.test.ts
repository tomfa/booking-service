import { Resource } from '../graphql/generated/types';
import {
  constructAllSlots,
  constructSlotsForDay,
  findNextValidTimeSlotStart,
} from './schedule.utils';
import { fromGQLDate, reduceAvailability } from './date.utils';

const mondayResource: Resource = {
  id: 'alwaysopen',
  label: 'Chermics',
  timezone: 'Africa/Accra',
  schedule: {
    fri: {
      end: '',
      start: '',
      slotDurationMinutes: 0,
      slotIntervalMinutes: 0,
    },
    mon: {
      end: '00:00',
      start: '00:00',
      slotDurationMinutes: 30,
      slotIntervalMinutes: 15,
    },
    sat: {
      end: '',
      start: '',
      slotDurationMinutes: 0,
      slotIntervalMinutes: 0,
    },
    sun: {
      end: '',
      start: '',
      slotDurationMinutes: 0,
      slotIntervalMinutes: 0,
    },
    thu: {
      end: '',
      start: '',
      slotDurationMinutes: 0,
      slotIntervalMinutes: 0,
    },
    tue: {
      end: '',
      start: '',
      slotDurationMinutes: 0,
      slotIntervalMinutes: 0,
    },
    wed: {
      end: '',
      start: '',
      slotDurationMinutes: 0,
      slotIntervalMinutes: 0,
    },
    overriddenDates: [],
  },
  seats: 20,
  enabled: true,
};

describe('constructSlotsForDay', () => {
  test('returns slots for 24-hour open day', () => {
    const openMonday = new Date(`2021-09-13T20:00:00Z`);
    const slots = constructSlotsForDay({
      resource: mondayResource,
      date: openMonday,
    });
    expect(slots.length).toBe(95);
  });
  test('returns empty array for closed day', () => {
    const closedSundayDay = new Date(`2021-09-12T20:00:00Z`);
    const slots = constructSlotsForDay({
      resource: mondayResource,
      date: closedSundayDay,
    });
    expect(slots.length).toBe(0);
  });
});
describe('constructAllSlots', () => {
  test('it handles 24-hour open days', () => {
    const slots = constructAllSlots({
      resource: mondayResource,
      from: new Date(`2021-06-20T22:00:00Z`), // Sunday, closed
      to: new Date(`2021-06-23T01:00:00Z`),
    });
    const slotStarts = slots.map(s => fromGQLDate(s.start).toISOString());
    expect(slotStarts[0]).toBe('2021-06-21T00:00:00.000Z'); // Opens mondays
    expect(slotStarts[slotStarts.length - 1]).toBe('2021-06-21T23:30:00.000Z');
    const minuteDiffBetweenDurationAndInterval = 15;
    expect(slotStarts.length).toBe(
      (24 * 60 - minuteDiffBetweenDurationAndInterval) /
        mondayResource.schedule.mon.slotIntervalMinutes
    );
  });
  test('does not return slots after end in last date', () => {
    const slots = constructAllSlots({
      resource: mondayResource,
      from: new Date(`2021-06-20T22:00:00Z`), // Sunday, closed
      to: new Date(`2021-06-21T12:00:00Z`), // Halfway in monday
    });
    const slotStarts = slots.map(s => fromGQLDate(s.start).toISOString());
    expect(slotStarts[0]).toBe('2021-06-21T00:00:00.000Z'); // Opens mondays
    expect(slotStarts[slotStarts.length - 1]).toBe('2021-06-21T11:30:00.000Z');
  });
  test('performs OK', () => {
    const start = Date.now();
    const slots = constructAllSlots({
      resource: mondayResource,
      from: new Date(`2021-06-20T22:00:00Z`),
      to: new Date(`2021-12-23T01:00:00Z`), // 6 months
    });
    // TODO: Test with a selection of relevant bookings
    reduceAvailability(slots, []);
    const end = Date.now();
    expect(end - start).toBeLessThan(1000);
  });
});
describe('findNextValidTimeSlot', () => {
  test('returns next timeslot', () => {
    const from = new Date('2021-06-20T22:00:00.000Z'); // Sunday
    const to = new Date('2021-06-23T01:00:00.000Z');
    const nextTimeSlotStart = findNextValidTimeSlotStart(
      mondayResource,
      from,
      to
    );
    expect(nextTimeSlotStart.toISOString()).toBe('2021-06-21T00:00:00.000Z');
  });
  test('returns same date as passed in if it fits a slot start time', () => {
    const from = new Date('2021-09-13T00:00:00Z'); // Monday
    const to = new Date('2021-09-13T12:00:00Z');
    const nextTimeSlotStart = findNextValidTimeSlotStart(
      mondayResource,
      from,
      to
    );
    expect(nextTimeSlotStart.toISOString()).toBe('2021-09-13T00:00:00.000Z');
  });
  test('returns next slot if date is 1ms over slot time', () => {
    const from = new Date('2021-09-13T00:00:00Z'); // Monday
    const to = new Date('2021-09-13T12:00:00Z');
    const nextTimeSlotStart = findNextValidTimeSlotStart(
      mondayResource,
      new Date(from.getTime() + 1),
      to
    );
    expect(nextTimeSlotStart.toISOString()).toBe('2021-09-13T00:15:00.000Z');
  });
});
