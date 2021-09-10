import React from 'react';
import styles from './Checkbox.module.scss';

type CheckboxProps = {
  setChecked: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  checked: boolean;
  className?: string;
};
export const Checkbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
  return (
    <button
      className={[styles.container, props.className || ''].join(' ')}
      onClick={() => {
        props.setChecked(!props.checked);
      }}>
      <CheckBoxIcon checked={props.checked} />
      <input type="checkbox" {...props} className={styles.hiddenInput} />
    </button>
  );
};

export const CheckBoxIcon = ({ checked }: { checked: boolean }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d)">
        <rect width="35" height="36" fill="#F7EFA6" />
        <path
          d="M6.5 20L12.5 26L29 9.5"
          stroke="black"
          strokeWidth={(checked && '3') || '0'}
        />
        <rect x="0.5" y="0.5" width="34" height="35" stroke="black" />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0"
          width="40"
          height="40"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="5" dy="4" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
