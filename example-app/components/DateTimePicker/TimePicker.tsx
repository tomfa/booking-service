import React, { useEffect, useState } from 'react';

import {
  getTimeOption,
  TimeStamp,
  timeStampAsOption,
  toTimeStamp,
} from '../../utils/date.utils';
import Dropdown from './Dropdown';

import styles from './TimePicker.module.scss';
import { Option } from './types';

interface Props {
  intervalMinutes?: number;
  fromTime: TimeStamp;
  toTime: TimeStamp;
  selectedTime?: TimeStamp;
  onValueChange: (selectedTime?: TimeStamp) => void;
  className?: string;
}

const DEFAULT_TIME_INTERVAL_MINUTES = 15;

const TimePicker = ({
  fromTime,
  toTime,
  onValueChange,
  selectedTime,
  intervalMinutes = DEFAULT_TIME_INTERVAL_MINUTES,
  className,
}: Props) => {
  const [timeOptions, setTimeOptions] = useState<Array<Option>>([]);
  const matchingOption =
    selectedTime &&
    timeOptions.find(o => o.value == timeStampAsOption(selectedTime).value);

  const updateOptions = () =>
    setTimeOptions(getTimeOption({ fromTime, toTime, intervalMinutes }));
  const onChange = (value: Option | undefined) =>
    onValueChange(value && toTimeStamp(value.value));
  const setDefaultTime = () => {
    if (!timeOptions.length) {
      onValueChange(undefined);
      return;
    }
    if (!selectedTime || !matchingOption) {
      onValueChange(toTimeStamp(timeOptions[0].value));
    }
  };

  useEffect(updateOptions, [fromTime, toTime, intervalMinutes]);
  useEffect(setDefaultTime, [
    matchingOption,
    onValueChange,
    selectedTime,
    timeOptions,
  ]);

  return (
    <Dropdown
      value={matchingOption}
      options={timeOptions}
      onValueSelect={onChange}
      className={[styles.timePicker, className].join(' ')}
    />
  );
};

export default TimePicker;
