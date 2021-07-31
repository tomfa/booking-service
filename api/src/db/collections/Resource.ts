import { Collection } from 'fireorm';

type HourSchedule = {
  start: string;
  end: string;
  slotIntervalMinutes: number;
  slotDurationMinutes: number;
};

type DateSchedule = {
  isoDate: string;
  schedule: HourSchedule;
};

type Schedule = {
  mon: HourSchedule;
  tue: HourSchedule;
  wed: HourSchedule;
  thu: HourSchedule;
  fri: HourSchedule;
  sat: HourSchedule;
  sun: HourSchedule;
  overriddenDates?: DateSchedule[];
};

@Collection()
export class Resource {
  id: string;
  customerId: string;
  category?: string;
  label: string;
  schedule: Schedule;
  seats: number;
  enabled: boolean;
}
