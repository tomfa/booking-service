import React from 'react';

type TimeSelectorProps = {
  label?: string;
  minDate: Date;
  maxDate: Date;
  timeInterval: number;
};
export const TimeSelector = ({
  label,
  minDate,
  maxDate,
  timeInterval,
}: TimeSelectorProps) => {
  return (
    <select>
      {Object.entries(options).map(([k, v]) => (
        <option key={k} value={k}>
          {v}
        </option>
      ))}
    </select>
  );
};
