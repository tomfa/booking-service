import styled from 'styled-components';

export const ProfileDropdownWrapper = styled.div`
  position: relative;
`;

export const ProfileDropdownMenu = styled.div`
  position: absolute;
  right: -1rem;
  background: ${p => p.theme.colors.primary};
  padding: 1rem;
  min-width: 300px;
  max-width: 95vw;
  text-align: right;
`;
