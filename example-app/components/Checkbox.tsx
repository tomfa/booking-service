import React from 'react';
import styles from './Checkbox.module.scss';

type CheckboxProps = {
  setChecked: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  checked: boolean;
  className?: string;
};
export const Checkbox: React.FC<CheckboxProps> = ({
  setChecked,
  ...props
}: CheckboxProps) => {
  return (
    <button
      className={[styles.container, props.className || ''].join(' ')}
      onClick={() => {
        setChecked(!props.checked);
      }}>
      <CheckBoxIcon checked={props.checked} className={styles.checkbox} />
      <input
        type="checkbox"
        {...props}
        className={styles.hiddenInput}
        readOnly
      />
    </button>
  );
};

export const CheckBoxIcon = ({
  checked,
  className,
}: {
  checked: boolean;
  className?: string;
}) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <g>
        <rect
          width="36"
          height="36"
          fill="#F7EFA6"
          stroke={'black'}
          strokeWidth={'2'}
        />
        <path
          d="M6.5 20L12.5 26L29 9.5"
          stroke="black"
          strokeWidth={(checked && '3') || '0'}
        />
      </g>
    </svg>
  );
};
