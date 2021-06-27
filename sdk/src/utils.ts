import { HourSchedule, IsoDate, OpeningHour, Schedule } from './types';

export const createSchedule = (
  defaultSchedule: OpeningHour,
  overrides?: {
    mon?: Partial<OpeningHour>;
    tue?: Partial<OpeningHour>;
    wed?: Partial<OpeningHour>;
    thu?: Partial<OpeningHour>;
    fri?: Partial<OpeningHour>;
    sat?: Partial<OpeningHour>;
    sun?: Partial<OpeningHour>;
    overriddenDates?: Record<IsoDate, Partial<OpeningHour>>;
  }
): Schedule => {
  const withDefaults = (specifiedHours?: Partial<OpeningHour>): OpeningHour => {
    if (!specifiedHours) {
      return defaultSchedule;
    }
    if (specifiedHours === 'closed') {
      return 'closed';
    }
    if (defaultSchedule === 'closed') {
      if (!isValidHourSchedule(specifiedHours)) {
        throw new Error(
          `DaySchedule can not be partial when default schedule is closed.`
        );
      }
      return specifiedHours;
    }
    return { ...defaultSchedule, ...specifiedHours };
  };
  const overriddenDates =
    overrides?.overriddenDates &&
    Object.fromEntries(
      Object.entries(overrides.overriddenDates).map(([k, v]) => [
        k,
        withDefaults(v),
      ])
    );
  return {
    mon: withDefaults(overrides?.mon),
    tue: withDefaults(overrides?.tue),
    wed: withDefaults(overrides?.wed),
    thu: withDefaults(overrides?.thu),
    fri: withDefaults(overrides?.fri),
    sat: withDefaults(overrides?.sat),
    sun: withDefaults(overrides?.sun),
    overriddenDates: overriddenDates || {},
  };
};

const isValidHourSchedule = (
  schedule: Partial<HourSchedule>
): schedule is HourSchedule => {
  return (
    schedule.start &&
    schedule.end &&
    schedule.slotDurationMinutes !== undefined &&
    schedule.slotIntervalMinutes !== undefined
  );
};

// DUplicate. TODO: Move to shared
export const fromGQLDate = (seconds: number): Date => new Date(seconds * 1000);
export const toGQLDate = (date: Date): number =>
  Math.floor(date.getTime() / 1000);

export const getIsoDate = (date: Date): IsoDate => {
  return date.toISOString().substr(0, 10);
};
