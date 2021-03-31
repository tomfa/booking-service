import {
  Link as LinkIcon,
  IconProps as PhoshopProps,
  DownloadSimple as Download,
  Check,
  CopySimple as Copy,
  TrashSimple as Trash,
  HourglassMedium,
  X,
  Warning,
  Info,
  Archive,
  TextT,
  FileArrowDown,
  File,
  Gear,
  Key,
} from 'phosphor-react';
import { MouseEventHandler } from 'react';
import NextLink from 'next/link';
import { IconWrapper } from './Icon.styles';
import { BlankButton } from './Button.style';
import { Link } from './Link.styles';

export enum IconType {
  LINK,
  DOWNLOAD,
  COPY,
  CHECK,
  REMOVE,
  ARCHIVE,
  CLOSE,
  WARN,
  INFO,
  DOCUMENT,
  DOWNLOAD_DOCUMENT,
  COGWHEEL,
  FONT,
  AUTH,
  LOADING,
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
  if (icon === IconType.ARCHIVE) {
    return <Archive {...props} />;
  }
  if (icon === IconType.DOCUMENT) {
    return <File {...props} />;
  }
  if (icon === IconType.DOWNLOAD_DOCUMENT) {
    return <FileArrowDown {...props} />;
  }
  if (icon === IconType.COGWHEEL) {
    return <Gear {...props} />;
  }
  if (icon === IconType.FONT) {
    return <TextT {...props} />;
  }
  if (icon === IconType.AUTH) {
    return <Key {...props} />;
  }
  if (icon === IconType.LOADING) {
    return <HourglassMedium {...props} />;
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
  style?: React.CSSProperties;
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
  style,
}: IconProps) => {
  return (
    <IconWrapper
      $secondary={secondary}
      $hoverable={hoverable}
      $color={color}
      $hoverColor={hoverColor}
      $withPadding={withPadding}
      style={style}>
      <IconSVG icon={icon} weight={'bold'} size={size} />
    </IconWrapper>
  );
};
export const IconLink = ({ href, ...props }: IconLinkProps) => {
  const useNextLink = !href.startsWith('http');
  return (
    <Link href={href} as={useNextLink ? NextLink : 'a'}>
      <Icon {...props} hoverable withPadding />
    </Link>
  );
};

type IconButtonProps = Omit<IconProps, 'hoverable'> & {
  onClick: MouseEventHandler<HTMLButtonElement>;
};
export const IconButton = ({ onClick, ...props }: IconButtonProps) => (
  <BlankButton
    onClick={onClick}
    hoverColor={props.hoverColor}
    color={props.color}>
    <Icon
      hoverable
      withPadding
      color={props.color}
      hoverColor={props.hoverColor}
      {...props}
    />
  </BlankButton>
);
