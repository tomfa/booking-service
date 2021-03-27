import styled from 'styled-components';

export const IconWrapper = styled.span<{
  $secondary?: boolean;
  $hover?: boolean;
}>`
  display: flex;
  padding: 0.5rem;
  color: ${p =>
    p.$secondary ? p.theme.colors.textSecondary : p.theme.colors.textPrimary};

  ${p =>
    p.$hover &&
    `
      &:hover {
        color: ${
          !p.$secondary
            ? p.theme.colors.textSecondary
            : p.theme.colors.textPrimary
        };
      }
  `}
`;
