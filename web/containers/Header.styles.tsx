import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background: ${p => p.theme.colors.primary};
  width: 100vw;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;

  width: 100%;
  max-width: 700px;
  padding: 1rem;
`;
