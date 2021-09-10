import React from 'react';
import styles from './Button.module.scss';

export const Button: React.FC<{
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ onClick, disabled = false, children, type = 'button' }) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      type={type}>
      {children}
    </button>
  );
};
