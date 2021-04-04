import styled from 'styled-components';
import { large } from '../styles/mediaQueries';

export const IconWrapper = styled.span<{
  $secondary?: boolean;
  $color?: string;
  $hoverColor?: string;
  $hoverable?: boolean;
  $withPadding?: boolean;
}>`
  display: flex;
  padding: ${p => (p.$withPadding ? '0.5rem' : '0')};
  align-items: center;
  color: ${p =>
    p.$color ||
    (p.$secondary ? p.theme.colors.textSecondary : p.theme.colors.textPrimary)};

  ${p =>
    p.$hoverable &&
    `
      border: 1px dashed ${
        p.$color ||
        (p.$secondary
          ? p.theme.colors.textSecondary
          : p.theme.colors.textPrimary)
      };
      
      ${large} {
        border: none;
        
        &:hover, &:focus {
          box-shadow: inset -1px 1px 3px 0px rgba(0, 0, 0, 0.75);
          color: ${
            p.$hoverColor ||
            (!p.$secondary
              ? p.theme.colors.textSecondary
              : p.theme.colors.textPrimary)
          };
        }
        
      }

  `}
`;
