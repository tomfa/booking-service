import { Booking, Resource } from '../graphql/generated/types';
import { toGQLDate } from '../utils/date.utils';
import { findAvailabilityForSingleResource } from './findAvailability';

describe('findAvailabilityForSingleResource', () => {
  const resource: Resource = {
    id: '2efaec23-83e1-4409-8d17-33360b0dcc84',
    category: null,
    label: 'My first Spa',
    timezone: 'Europe/Moscow',
    schedule: {
      mon: {
        start: '12:00',
        end: '20:00',
        slotIntervalMinutes: 60,
        slotDurationMinutes: 60,
        __typename: 'HourSchedule',
      },
      tue: {
        start: '08:00',
        end: '20:00',
        slotIntervalMinutes: 30,
        slotDurationMinutes: 60,
        __typename: 'HourSchedule',
      },
      wed: {
        start: '08:00',
        end: '20:00',
        slotIntervalMinutes: 30,
        slotDurationMinutes: 60,
        __typename: 'HourSchedule',
      },
      thu: {
        start: '',
        end: '',
        slotIntervalMinutes: 30,
        slotDurationMinutes: 60,
        __typename: 'HourSchedule',
      },
      fri: {
        start: '08:00',
        end: '20:00',
        slotIntervalMinutes: 30,
        slotDurationMinutes: 60,
        __typename: 'HourSchedule',
      },
      sat: {
        start: '08:00',
        end: '20:00',
        slotIntervalMinutes: 30,
        slotDurationMinutes: 60,
        __typename: 'HourSchedule',
      },
      sun: {
        start: '08:00',
        end: '20:00',
        slotIntervalMinutes: 30,
        slotDurationMinutes: 60,
        __typename: 'HourSchedule',
      },
      overriddenDates: [],
    },
    seats: 12,
    enabled: true,
    __typename: 'Resource',
  };

  const bookings: Booking[] = [
    {
      canceled: false,
      comment: null,
      end: toGQLDate(new Date('2021-09-12T14:30:00Z')),
      start: toGQLDate(new Date('2021-09-12T13:00:00Z')),
      seatNumbers: [1, 2, 3],
      resourceId: '2efaec23-83e1-4409-8d17-33360b0dcc84',
      id: '105dcdb3-b401-4771-877b-4c53e0ec3408',
      userId: null,
    },
    {
      canceled: false,
      comment: null,
      end: toGQLDate(new Date('2021-09-12T12:00:00Z')),
      start: toGQLDate(new Date('2021-09-12T10:00:00Z')),
      seatNumbers: [0],
      resourceId: '2efaec23-83e1-4409-8d17-33360b0dcc84',
      id: '10c4bda7-1f78-4771-ae22-722ec3651201',
      userId: null,
    },
  ];
  test('returns available slots that starts >= from and starts < to, regardless of when it ends', () => {
    const from = new Date('2021-09-12T12:00:00Z');
    const to = new Date('2021-09-12T12:30:00Z');
    const availableSlots = findAvailabilityForSingleResource(
      resource,
      from,
      to,
      bookings
    );
    expect(availableSlots).toEqual([
      {
        availableSeats: 12,
        start: toGQLDate(new Date('2021-09-12T12:00:00Z')),
        end: toGQLDate(new Date('2021-09-12T13:00:00Z')),
        seatsAvailable: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
    ]);
  }, 10000);
  test('removes seats taken from other bookings', () => {
    const from = new Date('2021-09-12T14:00:00Z');
    const to = new Date('2021-09-12T15:00:00Z');
    const availableSlots = findAvailabilityForSingleResource(
      resource,
      from,
      to,
      bookings
    );
    expect(availableSlots).toEqual([
      {
        availableSeats: 9,
        start: toGQLDate(new Date('2021-09-12T14:00:00Z')),
        end: toGQLDate(new Date('2021-09-12T15:00:00Z')),
        seatsAvailable: [0, 4, 5, 6, 7, 8, 9, 10, 11],
      },
      {
        availableSeats: 12,
        start: toGQLDate(new Date('2021-09-12T14:30:00Z')),
        end: toGQLDate(new Date('2021-09-12T15:30:00Z')),
        seatsAvailable: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
    ]);
  }, 10000);
});
