import { MouseEventHandler } from 'react';
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
  User,
  LockSimple as Lock,
} from 'phosphor-react';

import Link from 'next/link';

export enum IconType {
  LINK,
  DOWNLOAD,
  COPY,
  USER,
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
  LOCK,
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
  if (icon === IconType.USER) {
    return <User {...props} />;
  }
  if (icon === IconType.LOCK) {
    return <Lock {...props} />;
  }
  throw new Error(`Icon type ${icon} not supported`);
};

type IconProps = {
  icon: IconType;
  size?: number;
  className?: string;
};
type IconLinkProps = Omit<IconProps, 'hoverable'> & { href: string };

export const Icon = ({ icon, size = 11, className }: IconProps) => {
  return (
    <span className={className}>
      <IconSVG icon={icon} weight={'bold'} size={size} />
    </span>
  );
};
export const IconLink = ({ href, ...props }: IconLinkProps) => {
  return (
    <Link href={href}>
      <Icon {...props} />
    </Link>
  );
};

export type IconButtonProps = Omit<IconProps, 'hoverable'> & {
  onClick: MouseEventHandler<HTMLButtonElement>;
};
export const IconButton = ({ onClick, ...props }: IconButtonProps) => (
  <button onClick={onClick}>
    <Icon {...props} />
  </button>
);
