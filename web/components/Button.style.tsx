import styled from 'styled-components';

export const BlankButton = styled.button<{
  color?: string;
  hoverColor?: string;
}>`
  all: unset;
  cursor: pointer;
  color: ${p => p.color || p.theme.colors.textSecondary};
  word-wrap: break-word;

  &:focus,
  &:hover {
    color: ${p => p.hoverColor || p.theme.colors.textPrimary};
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
