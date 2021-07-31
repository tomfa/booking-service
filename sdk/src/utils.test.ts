import { createSchedule } from './utils';

describe('utils', () => {
  describe('createSchedule', () => {
    it('accepts default opening hours argument and returns a schedule using that', () => {
      const defaultHours = {
        start: '08:00',
        end: '16:00',
        slotDurationMinutes: 30,
        slotIntervalMinutes: 15,
      };

      const schedule = createSchedule(defaultHours);

      expect(schedule).toEqual({
        mon: defaultHours,
        tue: defaultHours,
        wed: defaultHours,
        thu: defaultHours,
        fri: defaultHours,
        sat: defaultHours,
        sun: defaultHours,
        overriddenDates: {},
      });
    });
    it('accepts partial overrides for week day or date', () => {
      const defaultHours = {
        start: '08:00',
        end: '16:00',
        slotDurationMinutes: 30,
        slotIntervalMinutes: 15,
      };

      const schedule = createSchedule(defaultHours, {
        sat: { start: '12:00' },
        sun: 'closed',
        overriddenDates: { '2021-05-17': 'closed' },
      });

      expect(schedule).toEqual({
        mon: defaultHours,
        tue: defaultHours,
        wed: defaultHours,
        thu: defaultHours,
        fri: defaultHours,
        sat: {
          ...defaultHours,
          start: '12:00',
        },
        sun: 'closed',
        overriddenDates: {
          '2021-05-17': 'closed',
        },
      });
    });
    it('can have closed defaultSchedule', () => {
      const schedule = createSchedule('closed', {
        overriddenDates: {
          '2021-05-17': {
            start: '08:00',
            end: '16:00',
            slotDurationMinutes: 30,
            slotIntervalMinutes: 15,
          },
        },
      });

      expect(schedule).toEqual({
        mon: 'closed',
        tue: 'closed',
        wed: 'closed',
        thu: 'closed',
        fri: 'closed',
        sat: 'closed',
        sun: 'closed',
        overriddenDates: {
          '2021-05-17': {
            start: '08:00',
            end: '16:00',
            slotDurationMinutes: 30,
            slotIntervalMinutes: 15,
          },
        },
      });
    });
    it('throws an error when partial overrides are used on closed defaults', () => {
      expect(() =>
        createSchedule('closed', {
          sat: { start: '12:00' },
        })
      ).toThrow(
        'DaySchedule can not be partial when default schedule is closed.'
      );
    });
  });
});
