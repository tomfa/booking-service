import { ReactNode } from 'react';
import { useTheme } from 'styled-components';
import { Button } from './LineHeader.styles';
import { H2 } from './H2.styles';
import { Icon, IconType } from './Icon';

export const LineHeader = ({
  header,
  onClick,
  hideButton,
  buttonLabel,
  icon,
}: {
  header: string | ReactNode;
  onClick?: () => void;
  hideButton?: boolean;
  buttonLabel?: string;
  icon?: IconType;
}) => {
  const theme = useTheme();
  return (
    <H2 style={{ justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        {icon && (
          <Icon
            size={30}
            icon={icon}
            color={theme.colors.secondary}
            style={{
              display: 'flex',
              marginRight: '0.45rem',
              marginBottom: '0.2rem',
            }}
          />
        )}
        {header}
      </div>
      {!hideButton && <Button onClick={onClick}>{buttonLabel}</Button>}
    </H2>
  );
};
