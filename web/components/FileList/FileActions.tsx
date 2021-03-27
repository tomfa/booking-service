import { FileDataDTO } from '@pdf-generator/shared';
import { useCallback, useState } from 'react';
import { useTheme } from 'styled-components';
import { IconButton, IconLink, IconType } from '../Icon';
import { copyToClipBoard } from '../utils/clipboard.utils';
import { ActionWrapper } from './FileActions.styles';

type Props = { file: FileDataDTO };
export const FileActions = ({ file }: Props) => {
  const theme = useTheme();
  const [hasCopied, setCopied] = useState<boolean>(false);
  const onCopy = useCallback(() => {
    // Display something?
    copyToClipBoard([file.url]);
    setCopied(true);
  }, [file.url]);
  const onDelete = useCallback(() => {
    // TODO: actually remove
    // eslint-disable-next-line no-console
    console.log('Slett');
  }, []);
  return (
    <ActionWrapper>
      <IconLink icon={IconType.DOWNLOAD} href={file.url} secondary />
      <IconButton
        icon={(hasCopied && IconType.CHECK) || IconType.LINK}
        onClick={onCopy}
        secondary
        hoverColor={(hasCopied && theme.colors.success) || theme.colors.links}
      />
      <IconButton
        icon={IconType.REMOVE}
        onClick={onDelete}
        secondary
        hoverColor={theme.colors.danger}
      />
    </ActionWrapper>
  );
};
