import { useState } from 'react';
import { Checkbox } from './Checkbox';
import styles from './SeatSelectInput.module.scss';

export const SeatSelectInput = (props: {
  seatNumber: number;
  available: boolean;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}) => {
  const inputId = String(props.seatNumber);
  return (
    <div className={styles.container}>
      <label htmlFor={inputId} className={styles.label}>
        Sone {props.seatNumber}
      </label>
      <div className={styles.rowLine} />
      {props.available && (
        <Checkbox
          className={styles.checkbox}
          id={inputId}
          checked={props.checked}
          setChecked={props.setChecked}
        />
      )}
      {!props.available && <p className={styles.checkbox}>Ikke ledig</p>}
    </div>
  );
};
