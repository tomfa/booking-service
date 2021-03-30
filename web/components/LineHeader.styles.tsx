import styled from 'styled-components';
import { BlankButton } from './Button.style';

export const Header = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const Button = styled(BlankButton)`
  font-size: 0.4em;

  color: ${p => p.theme.colors.textPrimary};

  &:hover,
  &:focus {
    color: ${p => p.theme.colors.primary};
  }
`;
