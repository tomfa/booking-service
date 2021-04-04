import Link from 'next/link';
import { config } from '../config';
import { Nav, Wrapper, LinkList, LinkListItem } from './Footer.styles';

export const Footer = () => {
  return (
    <Wrapper>
      <Nav>
        <LinkList>
          <LinkListItem>v.{config.CONFIG_BUILD_ID}</LinkListItem>
          <LinkListItem>© {new Date().getFullYear()} DocForest </LinkListItem>
          <LinkListItem>
            <Link href={'/privacy'}>Privacy policy</Link>
          </LinkListItem>
        </LinkList>
      </Nav>
    </Wrapper>
  );
};
