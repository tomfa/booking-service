import { Nav, Wrapper, LinkList, LinkListItem } from './Footer.styles';

export const Footer = () => {
  return (
    <Wrapper>
      <Nav>
        <LinkList>
          <LinkListItem>© {new Date().getFullYear()} docforest </LinkListItem>
        </LinkList>
      </Nav>
    </Wrapper>
  );
};
