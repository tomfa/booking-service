import { MouseEventHandler } from 'react';
import { Icon, IconType } from './Icon';
import { BaseButton, BlankButton } from './Button.style';

export const Button = ({
  label,
  icon,
  secondary,
  blank,
  onClick,
  style,
}: {
  label: string;
  icon?: IconType;
  secondary?: boolean;
  blank?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}) => {
  const ButtonComponent = blank ? BlankButton : BaseButton;
  return (
    <ButtonComponent onClick={onClick} style={style}>
      {icon && <Icon icon={icon} secondary={secondary} />}
      <span style={icon && { marginLeft: '0.3rem' }}>{label}</span>
    </ButtonComponent>
  );
};
