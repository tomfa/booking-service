import React from 'react';
import styles from './DisplayError.module.scss';

export const DisplayError: React.FC = ({ children }) => {
  return <span className={styles.container}>{children}</span>;
};
