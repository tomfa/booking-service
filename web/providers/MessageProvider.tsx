import { createContext, useCallback, useContext } from 'react';
import {
  useAlert,
  positions,
  transitions,
  Provider as AlertProvider,
  AlertProviderProps,
  AlertCustomOptionsWithType,
} from 'react-alert';
import { MessageTemplate } from '../components/Messages/MessageTemplate';

export enum MessageType {
  DANGER = 'error',
  SUCCESS = 'success',
  INFO = 'info',
}

export type Message = {
  title: string;
  description?: string;
  type?: MessageType;
  persist?: boolean;
};
export type MessageData = {
  addMessage: (message: Message) => void;
  clearMessages: () => void;
};

export const MessageContext = createContext<MessageData>(null);

const InnerMessageProvider = ({ children }: { children: React.ReactNode }) => {
  // @ts-ignore
  const { show, removeAll } = useAlert();
  const addMessage = useCallback(
    (message: Message) => {
      const options: AlertCustomOptionsWithType = {
        type: message.type,
        timeout: !message.persist && 5000,
      };
      if (!message.description) {
        show(message.title, options);
      } else {
        show(
          <>
            {message.title}
            <small style={{ display: 'block' }}>{message.description}</small>
          </>,
          options
        );
      }
    },
    [show]
  );

  return (
    <MessageContext.Provider
      value={{
        addMessage,
        clearMessages: removeAll,
      }}>
      {children}
    </MessageContext.Provider>
  );
};

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const options: AlertProviderProps = {
    position: positions.TOP_CENTER,
    offset: '0.5rem',
    transition: transitions.FADE,
    template: MessageTemplate,
  };
  return (
    <AlertProvider {...options}>
      <InnerMessageProvider>{children}</InnerMessageProvider>
    </AlertProvider>
  );
};
export const useMessage = (): MessageData => {
  return useContext(MessageContext);
};
