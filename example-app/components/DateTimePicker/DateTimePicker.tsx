import React, { useEffect, useMemo, useState } from 'react';

import {
  getDayOfWeek,
  Weekday,
  TimeStamp,
  addMinutes,
  subtractMinutes,
} from '../../utils/date.utils';

import styles from './DateTimePicker.module.scss';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import { HourSchedule, Schedule } from '../../graphql/generated/types';

type OpeningHours = HourSchedule;

interface Props {
  startDate?: Date;
  endDate?: Date;
  schedule: Schedule;
  onChange: (selectedDateTime: Date) => void;
  className?: string;
  isEndTime?: boolean;
  numDaysAheadAvailable?: number;
}

const DateTimePicker = ({
  schedule,
  onChange,
  className = '',
  startDate,
  endDate,
  numDaysAheadAvailable,
  isEndTime,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<TimeStamp | undefined>();
  const [dayOpeningHours, setDayOpening] = useState<OpeningHours | undefined>();
  const [excludeDays, setExcludeDays] = useState<Array<Weekday>>([]);

  const fromTime: TimeStamp = useMemo(() => {
    const start = dayOpeningHours?.start || '00:00';
    const [hour, minute] = start.split(':');
    const timeStamp = { hour: parseInt(hour), minute: parseInt(minute) };
    if (isEndTime) {
      return addMinutes(timeStamp, dayOpeningHours?.slotDurationMinutes || 0);
    }
    return timeStamp;
  }, [dayOpeningHours?.slotDurationMinutes, dayOpeningHours?.start, isEndTime]);

  const updateDayOpeningHours = () => {
    const dayOfWeek = selectedDate
      ? getDayOfWeek(selectedDate)
      : Weekday.MONDAY;
    const openHours = schedule[dayOfWeek];
    if (!openHours) {
      console.error('Attempted to select unselectable day');
      return;
    }
    setDayOpening(openHours);
  };
  const callOnChange = () => {
    if (!selectedTime || !selectedDate) {
      return;
    }
    let newDate = new Date(selectedDate);
    const minuteOfDay = selectedTime.hour * 60 + selectedTime.minute;
    newDate.setMinutes(minuteOfDay);
    if (isEndTime) {
      // End time might be in next day...
      const earliestEndTimeSelectionMinuteOfDate =
        fromTime.hour * 60 + fromTime.minute;
      const isNextDay = earliestEndTimeSelectionMinuteOfDate > minuteOfDay;
      if (isNextDay) {
        newDate = new Date(newDate.getTime() + 24 * 3600 * 1000);
      }
    }

    onChange(newDate);
  };
  const updateExcludedDays = () => {
    const closedDays = Object.values(Weekday).filter(
      w => !Object.keys(schedule).includes(w) || !schedule[w].start
    );
    setExcludeDays(closedDays);
  };

  useEffect(updateDayOpeningHours, [selectedDate, schedule]);
  useEffect(callOnChange, [
    selectedDate,
    selectedTime,
    onChange,
    isEndTime,
    fromTime.hour,
    fromTime.minute,
  ]);
  useEffect(updateExcludedDays, [schedule]);

  const toTime: TimeStamp = useMemo(() => {
    const end = dayOpeningHours?.end || '23:00';
    const [hour, minute] = end.split(':');
    const timeStamp = { hour: parseInt(hour), minute: parseInt(minute) };
    if (!isEndTime) {
      return subtractMinutes(
        timeStamp,
        dayOpeningHours?.slotDurationMinutes || 0
      );
    }
    return timeStamp;
  }, [dayOpeningHours?.end, dayOpeningHours?.slotDurationMinutes, isEndTime]);

  return (
    <div className={[styles.dateAndTimeWrapper, className].join(' ')}>
      <DatePicker
        value={selectedDate}
        startDate={startDate}
        endDate={endDate}
        onChange={setSelectedDate}
        excludeDays={excludeDays}
        className={styles.datePicker}
        numDaysAheadAvailable={numDaysAheadAvailable}
      />
      {dayOpeningHours && (
        <TimePicker
          fromTime={fromTime}
          toTime={toTime}
          selectedTime={selectedTime}
          intervalMinutes={dayOpeningHours.slotIntervalMinutes}
          onValueChange={setSelectedTime}
          className={styles.timePicker}
        />
      )}
    </div>
  );
};

export default DateTimePicker;
