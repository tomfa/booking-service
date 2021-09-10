import { Checkbox } from './Checkbox';
import styles from './SeatSelectInput.module.scss';

type SeatSelectInputProps = {
  seatNumber: number;
  available: boolean;
  checked: boolean;
  setChecked: (checked: boolean) => void;
};
export const SeatSelectInput = ({
  setChecked,
  available,
  ...props
}: SeatSelectInputProps) => {
  const inputId = String(props.seatNumber);
  return (
    <div className={styles.container}>
      <label htmlFor={inputId} className={styles.label}>
        Sone {props.seatNumber}
      </label>
      <div className={styles.rowLine} />
      {available && (
        <Checkbox
          className={styles.checkbox}
          id={inputId}
          checked={props.checked}
          setChecked={setChecked}
        />
      )}
      {!available && <p className={styles.checkbox}>Ikke ledig</p>}
    </div>
  );
};
