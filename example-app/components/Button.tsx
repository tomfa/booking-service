import React from 'react';
import styles from './Button.module.scss';

export const Button: React.FC<{ onClick: () => void }> = ({
  onClick,
  children,
}) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};
