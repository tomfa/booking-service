import React from 'react';
import { Schedule } from '../graphql/generated/types';
import { getWeekDayString, Weekday } from '../utils/date.utils';

const DayScheduleItem = ({
  day,
  schedule,
}: {
  day: Weekday;
  schedule: Schedule;
}) => {
  const daySchedule = schedule[day];
  const openingHours = !daySchedule.start
    ? 'Stengt'
    : `kl. ${daySchedule.start} - ${daySchedule.end}`;
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{getWeekDayString(day)}:</span> <span>{openingHours}</span>
    </li>
  );
};

export const ScheduleCalendar = ({ schedule }: { schedule?: Schedule }) => {
  return (
    <>
      <h3>Åpningstider</h3>
      <ul style={{ maxWidth: '300px' }}>
        {schedule && (
          <>
            <DayScheduleItem day={Weekday.MONDAY} schedule={schedule} />
            <DayScheduleItem day={Weekday.TUESDAY} schedule={schedule} />
            <DayScheduleItem day={Weekday.WEDNESDAY} schedule={schedule} />
            <DayScheduleItem day={Weekday.THURSDAY} schedule={schedule} />
            <DayScheduleItem day={Weekday.FRIDAY} schedule={schedule} />
            <DayScheduleItem day={Weekday.SATURDAY} schedule={schedule} />
            <DayScheduleItem day={Weekday.SUNDAY} schedule={schedule} />
          </>
        )}
      </ul>
    </>
  );
};
