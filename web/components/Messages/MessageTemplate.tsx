import { AlertComponentPropsWithStyle } from 'react-alert';
import { Icon, IconType } from '../Icon';

export const MessageTemplate = ({
  message,
  options,
  close,
  style,
}: AlertComponentPropsWithStyle) => {
  return (
    <div style={style}>
      <div>
        <div>
          <Icon icon={mapMessageType(options.type)} size={18} />
        </div>
        <div>{message}</div>
      </div>
      <button onClick={close}>
        <Icon icon={IconType.CLOSE} size={18} />
      </button>
    </div>
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
