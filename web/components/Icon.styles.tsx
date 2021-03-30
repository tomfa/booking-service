import styled from 'styled-components';

export const IconWrapper = styled.span<{
  $secondary?: boolean;
  $color?: string;
  $hoverColor?: string;
  $hoverable?: boolean;
  $withPadding?: boolean;
}>`
  display: flex;
  padding: ${p => (p.$withPadding ? '0.5rem' : '0')};
  color: ${p =>
    p.$color ||
    (p.$secondary ? p.theme.colors.textSecondary : p.theme.colors.textPrimary)};

  ${p =>
    p.$hoverable &&
    `
      @media (max-width: 700px) {
        border: 1px dashed ${
          p.$color ||
          (p.$secondary
            ? p.theme.colors.textSecondary
            : p.theme.colors.textPrimary)
        };
      }
      
      &:hover, &:focus {
        color: ${
          p.$hoverColor ||
          (!p.$secondary
            ? p.theme.colors.textSecondary
            : p.theme.colors.textPrimary)
        };
      }
  `}
`;
