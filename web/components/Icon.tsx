import {
  Link as LinkIcon,
  IconProps as PhoshopProps,
  DownloadSimple as Download,
  Check,
  CopySimple as Copy,
  TrashSimple as Trash,
  X,
  Warning,
  Info,
} from 'phosphor-react';
import { MouseEventHandler } from 'react';
import Link from 'next/link';
import { IconWrapper } from './Icon.styles';
import { BlankButton } from './Button.style';

export enum IconType {
  LINK,
  DOWNLOAD,
  COPY,
  CHECK,
  REMOVE,
  CLOSE,
  WARN,
  INFO,
}

interface ComponentProps extends PhoshopProps {
  icon: IconType;
}
const IconSVG = ({ icon, ...props }: ComponentProps) => {
  if (icon === IconType.COPY) {
    return <Copy {...props} />;
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
  if (icon === IconType.WARN) {
    return <Warning {...props} />;
  }
  if (icon === IconType.CLOSE) {
    return <X {...props} />;
  }
  if (icon === IconType.INFO) {
    return <Info {...props} />;
  }
  throw new Error(`Icon type ${icon} not supported`);
};

type IconProps = {
  icon: IconType;
  color?: string;
  hoverColor?: string;
  secondary?: boolean;
  hoverable?: boolean;
  withPadding?: boolean;
  size?: number;
};
type IconLinkProps = Omit<IconProps, 'hoverable'> & { href: string };

export const Icon = ({
  color,
  hoverColor,
  icon,
  secondary = false,
  hoverable = false,
  withPadding = false,
  size = 11,
}: IconProps) => {
  return (
    <IconWrapper
      $secondary={secondary}
      $hover={hoverable}
      $color={color}
      $hoverColor={hoverColor}
      $withPadding={withPadding}>
      <IconSVG icon={icon} weight={'bold'} size={size} />
    </IconWrapper>
  );
};
export const IconLink = ({ href, ...props }: IconLinkProps) => {
  if (href.startsWith('http')) {
    return (
      <a href={href}>
        <Icon {...props} hoverable withPadding />
      </a>
    );
  }
  return (
    <Link href={href}>
      <Icon {...props} hoverable withPadding />
    </Link>
  );
};

type IconButtonProps = Omit<IconProps, 'hoverable'> & {
  onClick: MouseEventHandler<HTMLButtonElement>;
};
export const IconButton = ({ onClick, ...props }: IconButtonProps) => (
  <BlankButton onClick={onClick}>
    <Icon {...props} hoverable withPadding />
  </BlankButton>
);
