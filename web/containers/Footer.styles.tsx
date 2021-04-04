import styled from 'styled-components';

export const Wrapper = styled.footer`
  display: flex;
  justify-content: center;
  width: 100vw;
  margin-top: 5rem;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: flex-end;
  justify-content: center;

  width: 100%;
  max-width: 700px;
  padding: 1rem;
`;

export const LinkList = styled.ul`
  display: flex;
  list-style: none;
`;

export const LinkListItem = styled.li`
  padding-right: 1rem;
  border-right: 1px solid white;
  margin-right: 1rem;
  opacity: 0.4;

  &:hover {
    opacity: 1;
  }

  & > a {
    color: ${p => p.theme.colors.textPrimary};
  }

  &:last-of-type {
    border-right: none;
    margin-right: 0;
    padding-right: 0;
  }
`;
