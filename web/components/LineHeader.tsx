import { Button } from './LineHeader.styles';
import { H2 } from './H2.styles';

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
    <H2 style={{ justifyContent: 'space-between' }}>
      {header}
      {!hideButton && <Button onClick={onClick}>{buttonLabel}</Button>}
    </H2>
  );
};
