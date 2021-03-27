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
  $secondary?: boolean;
  $hover?: boolean;
};
export const Icon = ({ $secondary, $hover, icon }: IconProps) => {
  return (
    <IconWrapper $secondary={$secondary} $hover={$hover}>
      <IconSVG icon={icon} weight={'bold'} />
    </IconWrapper>
  );
};

export const IconLink = ({
  icon,
  href,
  secondary = false,
}: {
  icon: IconType;
  secondary?: boolean;
  href: string;
}) => {
  if (href.startsWith('http')) {
    return (
      <a href={href}>
        <Icon $secondary={secondary} icon={icon} $hover />
      </a>
    );
  }
  return (
    <Link href={href}>
      <Icon $secondary={secondary} icon={icon} $hover />
    </Link>
  );
};

export const IconButton = ({
  icon,
  onClick,
  secondary = false,
}: {
  icon: IconType;
  onClick: MouseEventHandler<HTMLButtonElement>;
  secondary?: boolean;
}) => {
  return (
    <Button $blank onClick={onClick}>
      <Icon $secondary={secondary} icon={icon} $hover />
    </Button>
  );
};
