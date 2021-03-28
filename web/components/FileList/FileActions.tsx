import { FileDataDTO } from '@pdf-generator/shared';
import { useCallback, useState } from 'react';
import { useTheme } from 'styled-components';
import { IconButton, IconLink, IconType } from '../Icon';
import { copyToClipBoard } from '../utils/clipboard.utils';
import { MessageType, useMessage } from '../../providers/MessageProvider';
import { ActionWrapper } from './FileActions.styles';

type Props = { file: FileDataDTO };
export const FileActions = ({ file }: Props) => {
  const theme = useTheme();
  const { addMessage } = useMessage();
  const [hasCopied, setCopied] = useState<boolean>(false);
  const onCopy = useCallback(() => {
    copyToClipBoard([file.url]);
    addMessage({
      title: `File URL copied to clipboard`,
      type: MessageType.SUCCESS,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  }, [file.url, addMessage]);
  const onDelete = useCallback(() => {
    // TODO: actually remove
    // eslint-disable-next-line no-console
    console.log('Slett');
  }, []);
  return (
    <ActionWrapper>
      <IconLink icon={IconType.DOWNLOAD} href={file.url} secondary />
      <IconButton
        icon={(hasCopied && IconType.CHECK) || IconType.COPY}
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
