import { AlertComponentPropsWithStyle } from 'react-alert';
import { Icon, IconType } from '../Icon';
import {
  AlertWrapper,
  CloseButton,
  ContentWrapper,
  MessageIconWrapper,
  MessageText,
} from './MessageTemplate.styles';

export const MessageTemplate = ({
  message,
  options,
  close,
  style,
}: AlertComponentPropsWithStyle) => {
  return (
    <AlertWrapper style={style} $type={options.type}>
      <ContentWrapper>
        <MessageIconWrapper>
          <Icon icon={mapMessageType(options.type)} size={18} />
        </MessageIconWrapper>
        <MessageText>{message}</MessageText>
      </ContentWrapper>
      <CloseButton onClick={close}>
        <Icon icon={IconType.CLOSE} size={18} />
      </CloseButton>
    </AlertWrapper>
  );
};

const mapMessageType = (type: 'success' | 'error' | 'info'): IconType => {
  if (type === 'success') {
    return IconType.CHECK;
  }
  if (type === 'error') {
    return IconType.WARN;
  }
  return IconType.INFO;
};
