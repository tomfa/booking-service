import styled from 'styled-components';
import { large, to } from '../styles/mediaQueries';
import { Input } from './Input.styles';
import { Icon, IconButton } from './Icon';

export const Row = styled.div<{ $desktopOnly?: boolean }>`
  display: ${p => (p.$desktopOnly && 'none') || 'flex'};
  flex-direction: column;

  ${large} {
    display: flex;
    flex-direction: row;
  }
`;

export const NameInput = styled(Input)`
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  padding: 0.5rem;
  border: none;

  ${large} {
    margin-right: 0.2rem;
  }

  &:focus {
    outline: 3px solid ${p => p.theme.colors.primary};
  }
`;

export const ValueInput = styled(NameInput)`
  flex: auto;
`;

export const VariableDangerButton = styled(IconButton)`
  margin-bottom: 0.5rem;

  ${p => to(p.theme.layout.sizes.large)} {
    background-color: ${p => p.theme.colors.bgDanger};
    width: 100%;
    padding: 1rem;
    justify-content: center;
    border: none;
  }
`;

export const VariableButtonSuccess = styled(IconButton)`
  margin-bottom: 0.5rem;

  ${p => to(p.theme.layout.sizes.large)} {
    background-color: ${p => p.theme.colors.bgSuccess};
    width: 100%;
    padding: 1rem;
    justify-content: center;
    border: none;
  }
`;

export const VariableButtonDisabled = styled(Icon)`
  margin-bottom: 0.5rem;
  color: ${p => p.theme.colors.textSecondary};

  ${p => to(p.theme.layout.sizes.large)} {
    display: none;
  }
`;
