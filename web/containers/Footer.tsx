import Link from 'next/link';
import { Nav, Wrapper, LinkList, LinkListItem } from './Footer.styles';

export const Footer = () => {
  return (
    <Wrapper>
      <Nav>
        <LinkList>
          <LinkListItem>© {new Date().getFullYear()} DocForest </LinkListItem>
          <LinkListItem>
            <Link href={'/privacy'}>Privacy policy</Link>
          </LinkListItem>
        </LinkList>
      </Nav>
    </Wrapper>
  );
};
