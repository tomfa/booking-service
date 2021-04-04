import styled from 'styled-components';
import { large } from '../styles/mediaQueries';
import { IconWrapper } from './Icon.styles';

export const BlankButton = styled.button<{
  color?: string;
  hoverColor?: string;
  $large?: boolean;
  $noPadding?: boolean;
}>`
  background: transparent;
  font-size: ${p => (p.$large && `1.3rem`) || `0.75rem`};
  padding: ${p =>
    p.$noPadding ? '0' : (p.$large && `0.8rem 2rem`) || `0.5rem 1rem`};
  border-radius: 0;
  border: none;
  cursor: pointer;
  color: ${p => p.color || p.theme.colors.textSecondary};
  display: flex;
  justify-content: center;
  align-items: center;
  word-wrap: break-word;
  outline: none;
  min-width: ${p => (p.$large && '130px') || 'unset'};

  ${large} {
    &:focus,
    &:focus-within,
    &:hover {
      color: ${p => p.hoverColor || p.theme.colors.textPrimary};
      & > ${IconWrapper} {
        color: ${p => p.hoverColor || p.theme.colors.textPrimary};
        box-shadow: inset -1px 1px 3px 0px rgba(0, 0, 0, 0.75);
      }
    }
  }
`;

export const BaseButton = styled(BlankButton)`
  background-color: ${p => p.theme.colors.primary};

  ${large} {
    &:focus,
    &:focus-within,
    &:hover {
      color: ${p => p.hoverColor || p.theme.colors.textPrimary};
      & > ${IconWrapper} {
        box-shadow: unset;
      }
    }
  }
`;

export const ButtonText = styled.span<{ $addLeftMargin: boolean }>`
  margin-left: ${p => (p.$addLeftMargin && '0.3rem') || ''};
  word-break: keep-all;
`;
