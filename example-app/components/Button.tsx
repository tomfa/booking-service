import React from 'react';
import styles from './Button.module.scss';

export const Button: React.FC<{
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit';
  small?: boolean;
}> = ({ onClick, disabled = false, children, type = 'button', small }) => {
  return (
    <button
      className={(small && styles.buttonSmall) || styles.button}
      onClick={onClick}
      disabled={disabled}
      type={type}>
      {children}
    </button>
  );
};
