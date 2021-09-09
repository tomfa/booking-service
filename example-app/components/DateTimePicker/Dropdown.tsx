import React from 'react';
import { Option } from './types';
import styles from './Dropdown.module.scss';
import { CarotDown } from '../icons/Carot';

interface Props {
  options: Array<Option>;
  value?: Option;
  onValueSelect: (value?: Option) => void;
  className?: string;
}

const Dropdown = ({ options, onValueSelect, value, className = '' }: Props) => {
  const onValueChange = (value: string) =>
    onValueSelect(options.find(o => String(o.value) === value));
  return (
    <div className={[styles.dropdownCard, className].join(' ')}>
      <span className={styles.dropdownText}>{value && value.label}</span>
      <CarotDown />
      <select
        value={value ? value.value : undefined}
        className={styles.hiddenSelect}
        onChange={e => onValueChange(e.target.value)}>
        {options.map(option => (
          <option
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
