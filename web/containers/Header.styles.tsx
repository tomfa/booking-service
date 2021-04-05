import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  justify-content: center;
  background: ${p => p.theme.colors.primary};
  width: 100vw;
  z-index: ${p => p.theme.z.top};
`;

export const Nav = styled.nav`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;

  width: 100%;
  max-width: ${p => p.theme.layout.contentWidth}px;
  padding: 1rem;
`;
