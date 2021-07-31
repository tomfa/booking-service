import { validateDaySchedule } from './validation.utils';

describe('validateDaySchedule', () => {
  it('allows three letter weekdays as day', () => {
    validateDaySchedule({
      day: 'mon',
      start: '',
      end: '',
      slotIntervalMinutes: 30,
      slotDurationMinutes: 60,
    });
  });
  it('allows iso dates as day', () => {
    validateDaySchedule({
      day: '2021-06-21',
      start: '',
      end: '',
      slotIntervalMinutes: 30,
      slotDurationMinutes: 60,
    });
  });
  it('throws error for unknown day formats', () => {
    expect(() =>
      validateDaySchedule({
        day: 'swe',
        start: '',
        end: '',
        slotIntervalMinutes: 30,
        slotDurationMinutes: 60,
      })
    ).toThrow();
  });
  it('throws error for unknown date formats', () => {
    expect(() =>
      validateDaySchedule({
        day: '2021-06-21T00:00:00Z',
        start: '',
        end: '',
        slotIntervalMinutes: 30,
        slotDurationMinutes: 60,
      })
    ).toThrow();
  });
  it('allows both end or start to be blank (closed)', () => {
    validateDaySchedule({
      day: 'mon',
      start: '',
      end: '',
      slotIntervalMinutes: 30,
      slotDurationMinutes: 60,
    });
  });
  it('throws error if one of end or start is blank', () => {
    expect(() =>
      validateDaySchedule({
        day: 'mon',
        start: '',
        end: '16:00',
        slotIntervalMinutes: 30,
        slotDurationMinutes: 60,
      })
    ).toThrow();
  });
  it('throws error if end is before start', () => {
    expect(() =>
      validateDaySchedule({
        day: 'mon',
        start: '08:00',
        end: '06:00',
        slotIntervalMinutes: 30,
        slotDurationMinutes: 60,
      })
    ).toThrow();
  });
  it('allows ending at 00:00', () => {
    validateDaySchedule({
      day: 'mon',
      start: '08:00',
      end: '00:00',
      slotIntervalMinutes: 30,
      slotDurationMinutes: 60,
    });
  });
});
