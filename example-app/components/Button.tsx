import React from 'react';
import styles from './Button.module.scss';

export const Button: React.FC<{ onClick: () => void; disabled?: boolean }> = ({
  onClick,
  disabled = false,
  children,
}) => {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
