import styled from 'styled-components';
import { BlankButton } from './Button.style';

export const Button = styled(BlankButton)`
  font-size: 0.4em;
  padding: 0.5rem 0 0 1rem;

  color: ${p => p.theme.colors.textPrimary};

  &:hover,
  &:focus {
    color: ${p => p.theme.colors.primary};
  }
`;
