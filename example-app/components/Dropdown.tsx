import React from 'react';

export type Options = Record<string, string>;

export const Dropdown = ({
  label,
  options,
}: {
  label?: string;
  options: Options;
}) => {
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
