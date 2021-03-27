import {
  Link as LinkIcon,
  IconProps as PhoshopProps,
  Download,
  Check,
  Trash,
} from 'phosphor-react';
import { MouseEventHandler } from 'react';
import Link from 'next/link';
import { IconWrapper } from './Icon.styles';
import { Button } from './Button.style';

export enum IconType {
  LINK,
  DOWNLOAD,
  COPY,
  CHECK,
  REMOVE,
}

interface ComponentProps extends PhoshopProps {
  icon: IconType;
}
const IconSVG = ({ icon, ...props }: ComponentProps) => {
  if (icon === IconType.COPY) {
    return <LinkIcon {...props} />;
  }
  if (icon === IconType.LINK) {
    return <LinkIcon {...props} />;
  }
  if (icon === IconType.DOWNLOAD) {
    return <Download {...props} />;
  }
  if (icon === IconType.CHECK) {
    return <Check {...props} />;
  }
  if (icon === IconType.REMOVE) {
    return <Trash {...props} />;
  }
  throw new Error(`Icon type ${icon} not supported`);
};

type IconProps = {
  icon: IconType;
  secondary?: boolean;
  color?: string;
  hoverColor?: string;
  hoverable?: boolean;
};
type IconLinkProps = Omit<IconProps, 'hoverable'> & { href: string };

export const Icon = ({
  secondary,
  hoverable,
  color,
  hoverColor,
  icon,
}: IconProps) => {
  return (
    <IconWrapper
      $secondary={secondary}
      $hover={hoverable}
      $color={color}
      $hoverColor={hoverColor}>
      <IconSVG icon={icon} weight={'bold'} />
    </IconWrapper>
  );
};
export const IconLink = ({ href, ...props }: IconLinkProps) => {
  if (href.startsWith('http')) {
    return (
      <a href={href}>
        <Icon {...props} hoverable />
      </a>
    );
  }
  return (
    <Link href={href}>
      <Icon {...props} hoverable />
    </Link>
  );
};

type IconButtonProps = Omit<IconProps, 'hoverable'> & {
  onClick: MouseEventHandler<HTMLButtonElement>;
};
export const IconButton = ({ onClick, ...props }: IconButtonProps) => (
  <Button $blank onClick={onClick}>
    <Icon {...props} hoverable />
  </Button>
);
