import { Header, Button } from './LineHeader.styles';

export const LineHeader = ({
  header,
  onClick,
  hideButton,
  buttonLabel,
}: {
  header: string;
  onClick?: () => void;
  hideButton?: boolean;
  buttonLabel?: string;
}) => {
  return (
    <Header>
      {header}
      {!hideButton && <Button onClick={onClick}>{buttonLabel}</Button>}
    </Header>
  );
};
