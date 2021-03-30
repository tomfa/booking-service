import styled from 'styled-components';
import { BlankButton } from './Button.style';

export const Button = styled(BlankButton)`
  font-size: 0.4em;

  color: ${p => p.theme.colors.textPrimary};

  &:hover,
  &:focus {
    color: ${p => p.theme.colors.primary};
  }
`;
