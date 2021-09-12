import React, { useEffect, useMemo, useState } from 'react';

import {
  getDayOfWeek,
  Weekday,
  TimeStamp,
  addMinutes,
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
}

const DateTimePicker = ({
  schedule,
  onChange,
  className = '',
  startDate,
  endDate,
  isEndTime,
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<TimeStamp | undefined>();
  const [dayOpeningHours, setDayOpening] = useState<OpeningHours | undefined>();
  const [excludeDays, setExcludeDays] = useState<Array<Weekday>>([]);

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
    newDate.setMinutes(selectedTime.hour * 60 + selectedTime.minute);
    onChange(newDate);
  };
  const updateExcludedDays = () => {
    const closedDays = Object.values(Weekday).filter(
      w => !Object.keys(schedule).includes(w) || !schedule[w].start
    );
    setExcludeDays(closedDays);
  };

  useEffect(updateDayOpeningHours, [selectedDate, schedule]);
  useEffect(callOnChange, [selectedDate, selectedTime, onChange]);
  useEffect(updateExcludedDays, [schedule]);

  const fromTime: TimeStamp = useMemo(() => {
    const start = dayOpeningHours?.start || '00:00';
    const [hour, minute] = start.split(':');
    const timeStamp = { hour: parseInt(hour), minute: parseInt(minute) };
    if (isEndTime) {
      return addMinutes(timeStamp, dayOpeningHours?.slotIntervalMinutes || 0);
    }
    return timeStamp;
  }, [dayOpeningHours?.slotIntervalMinutes, dayOpeningHours?.start, isEndTime]);

  const toTime: TimeStamp = useMemo(() => {
    const end = dayOpeningHours?.end || '23:00';
    const [hour, minute] = end.split(':');
    const timeStamp = { hour: parseInt(hour), minute: parseInt(minute) };
    if (isEndTime) {
      return addMinutes(timeStamp, dayOpeningHours?.slotIntervalMinutes || 0);
    }
    return timeStamp;
  }, [dayOpeningHours?.end, dayOpeningHours?.slotIntervalMinutes, isEndTime]);

  return (
    <div className={[styles.dateAndTimeWrapper, className].join(' ')}>
      <DatePicker
        value={selectedDate}
        startDate={startDate}
        endDate={endDate}
        onChange={setSelectedDate}
        excludeDays={excludeDays}
        className={styles.datePicker}
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
