import styled from 'styled-components';
import { IconWrapper } from './Icon.styles';

export const BlankButton = styled.button<{
  color?: string;
  hoverColor?: string;
}>`
  all: unset;
  cursor: pointer;
  color: ${p => p.color || p.theme.colors.textSecondary};
  word-wrap: break-word;

  &:focus,
  &:focus-within,
  &:hover {
    color: ${p => p.hoverColor || p.theme.colors.textPrimary};
    & > ${IconWrapper} {
      box-shadow: inset -1px 1px 3px 0px rgba(0, 0, 0, 0.75);
    }
  }
`;

export const BaseButton = styled.button`
  font-size: 0.75rem;
  display: flex;
  word-wrap: break-word;
  align-items: center;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;
