import { HourMinute, OpeningHour } from './types';

export const openingHourGenerator = ({
  slotInterval,
  slotDuration,
}: {
  slotInterval: number;
  slotDuration: number;
}) => ({ start, end }: { start: HourMinute; end: HourMinute }): OpeningHour => {
  return {
    start,
    end,
    slotIntervalMinutes: slotInterval,
    slotDurationMinutes: slotDuration,
  };
};
