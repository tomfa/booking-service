import React, { useEffect, useState } from 'react';

import styles from './DatePicker.module.scss';
import * as dateUtils from '../../utils/date.utils';
import Dropdown from './Dropdown';

import { Option } from './types';

interface Props {
  startDate?: Date;
  endDate?: Date;
  excludeDays?: Array<dateUtils.Weekday>;
  onChange: (selectedDate?: Date) => void;
  value?: Date;
  className?: string;
  numDaysAheadAvailable?: number;
}

const DEFAULT_MAX_DATES_AHEAD = 30;

const DatePicker = ({
  onChange,
  className = '',
  startDate,
  endDate,
  value,
  excludeDays = [],
  numDaysAheadAvailable = DEFAULT_MAX_DATES_AHEAD,
}: Props) => {
  const [dateOptions, setDateOptions] = useState<Array<Option>>([]);

  const onSelect = (selectedDate: Option | undefined) =>
    onChange(selectedDate && new Date(selectedDate.value));

  const populateDateOptions = () => {
    const sDate = startDate || new Date();
    let eDate;
    if (endDate) {
      eDate = endDate;
    } else {
      eDate = dateUtils.plusTime(sDate, numDaysAheadAvailable, 'day');
    }
    const dateOptions = dateUtils.getDateOptions({
      startDate: sDate,
      endDate: eDate,
      excludeDays,
    });
    setDateOptions(dateOptions);
  };

  const setDefaultDate = () => {
    if (!dateOptions.length) {
      onChange(undefined);
      return;
    }
    const stringValue = value && dateUtils.asStringValue(value);
    if (!value || !dateOptions.find(o => o.value === stringValue)) {
      onChange(new Date(dateOptions[0].value));
    }
  };

  useEffect(populateDateOptions, [startDate, endDate, excludeDays]);
  useEffect(setDefaultDate, [dateOptions, onChange, value]);

  return (
    <Dropdown
      value={value && dateUtils.asOption(value)}
      options={dateOptions}
      onValueSelect={onSelect}
      className={[styles.datePicker, className].join(' ')}
    />
  );
};

export default DatePicker;
