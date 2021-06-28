import { Resource } from '../../graphql/generated/types';
import { constructAllSlots } from './schedule.utils';
import { fromGQLDate } from './date.utils';

const mondayResource: Resource = {
  id: 'alwaysopen',
  label: 'Chermics',
  schedule: {
    fri: {
      end: '',
      start: '',
      slotDurationMinutes: 0,
      slotIntervalMinutes: 0,
    },
    mon: {
      end: '23:59',
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

describe('constructAllSlots', () => {
  const openMonday = '2021-06-21';
  test('it handles 24-hour open days', () => {
    const slots = constructAllSlots({
      resource: mondayResource,
      from: new Date(`2021-06-20T22:00:00Z`),
      to: new Date(`2021-06-23T01:00:00Z`),
    });
    const slotStarts = slots.map(s => fromGQLDate(s.start).toISOString());
    expect(slotStarts[0]).toBe('2021-06-21T00:00:00.000Z');
    expect(slotStarts[slotStarts.length - 1]).toBe('2021-06-21T23:45:00.000Z');
    expect(slotStarts.length).toBe(
      (24 * 60) / mondayResource.schedule.mon.slotIntervalMinutes
    );
  });
});
