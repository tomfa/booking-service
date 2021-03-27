import styled from 'styled-components';

export const IconWrapper = styled.span<{
  $secondary?: boolean;
  $color?: string;
  $hoverColor?: string;
  $hover?: boolean;
}>`
  display: flex;
  padding: 0.5rem;
  color: ${p =>
    p.$color ||
    (p.$secondary ? p.theme.colors.textSecondary : p.theme.colors.textPrimary)};

  ${p =>
    p.$hover &&
    `
      &:hover {
        color: ${
          p.$hoverColor ||
          (!p.$secondary
            ? p.theme.colors.textSecondary
            : p.theme.colors.textPrimary)
        };
      }
  `}
`;
