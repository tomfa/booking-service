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
  max-width: ${p => p.theme.layout.contentWidth}px;
  padding: 1rem;
`;

export const LinkList = styled.ul`
  padding: 0;
  display: flex;
  list-style: none;
`;

export const LinkListItem = styled.li`
  border-right: 1px solid white;
  padding-right: 0.5rem;
  margin-right: 0.5rem;
  opacity: 0.7;
  font-size: 0.8rem;

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
