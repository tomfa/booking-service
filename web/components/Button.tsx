import { MouseEventHandler, ButtonHTMLAttributes } from 'react';
import { Icon, IconType } from './Icon';
import { BaseButton, BlankButton, ButtonText } from './Button.style';

export const Button = ({
  label,
  icon,
  large,
  secondary,
  blank,
  onClick,
  ...props
}: {
  label: string;
  icon?: IconType;
  large?: boolean;
  secondary?: boolean;
  blank?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const ButtonComponent = blank ? BlankButton : BaseButton;
  return (
    <ButtonComponent onClick={onClick} {...props} $large={large}>
      {icon && <Icon icon={icon} secondary={secondary} />}
      <ButtonText $addLeftMargin={!!icon}>{label}</ButtonText>
    </ButtonComponent>
  );
};
