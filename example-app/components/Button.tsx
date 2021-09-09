import React from 'react';

export const Button: React.FC<{ onClick: () => void }> = ({
  onClick,
  children,
}) => {
  return <button onClick={onClick}>{children}</button>;
};
