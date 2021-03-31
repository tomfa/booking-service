import { MouseEventHandler } from 'react';
import { Icon, IconType } from './Icon';
import { BaseButton, BlankButton } from './Button.style';

export const Button = ({
  label,
  icon,
  secondary,
  blank,
  onClick,
  ...props
}: {
  label: string;
  icon?: IconType;
  secondary?: boolean;
  blank?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const ButtonComponent = blank ? BlankButton : BaseButton;
  return (
    <ButtonComponent onClick={onClick} {...props}>
      {icon && <Icon icon={icon} secondary={secondary} />}
      <span style={icon && { marginLeft: '0.3rem' }}>{label}</span>
    </ButtonComponent>
  );
};
