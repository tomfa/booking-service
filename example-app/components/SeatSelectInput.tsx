import { Checkbox } from './Checkbox';
import styles from './SeatSelectInput.module.scss';

type SeatSelectInputProps = {
  seatNumber: number;
  available: boolean;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  isLoading: boolean;
};
export const SeatSelectInput = ({
  setChecked,
  available,
  ...props
}: SeatSelectInputProps) => {
  const inputId = `seatnumber-${props.seatNumber}`;
  const displayCheckbox = props.isLoading || available;
  return (
    <div className={styles.container}>
      <label htmlFor={inputId} className={styles.label}>
        Sone {props.seatNumber + 1}
      </label>
      <div className={styles.rowLine} />
      {displayCheckbox && (
        <Checkbox
          className={styles.checkbox}
          id={inputId}
          checked={props.checked}
          setChecked={setChecked}
          disabled={props.isLoading}
        />
      )}
      {!available && !props.isLoading && (
        <p className={styles.checkbox}>Ikke ledig</p>
      )}
    </div>
  );
};
