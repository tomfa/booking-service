import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../providers/AuthProvider';
import { Logo } from '../components/Logo';
import { IconButton, IconType } from '../components/Icon';
import { Code } from '../components/Code.styles';
import { Nav, Wrapper } from './Header.styles';
import {
  ProfileDropdownMenu,
  ProfileDropdownWrapper,
} from './ProfileDropdown.styles';

export const ProfileDropdown = () => {
  const auth = useAuth();
  const [isOpen, setOpen] = useState<boolean>(false);
  if (!auth.isLoggedIn) {
    return null;
  }
  return (
    <ProfileDropdownWrapper>
      <IconButton icon={IconType.USER} onClick={() => setOpen(o => !o)} />
      {isOpen && (
        <ProfileDropdownMenu>
          <Code style={{ flexDirection: 'column', marginBottom: '1rem' }}>
            <span style={{ opacity: 0.5, flex: '1' }}>{`//`} username:</span>
            {auth.username}
            <span style={{ opacity: 0.5, flex: '1', paddingTop: '1rem' }}>
              {`//`} api-key:
            </span>
            {auth.apiKey}
          </Code>
          <hr />
          <Link href={'/logout'}>
            <span>Log out</span>
          </Link>
        </ProfileDropdownMenu>
      )}
    </ProfileDropdownWrapper>
  );
};

export const Header = () => {
  return (
    <Wrapper>
      <Nav>
        <Logo />
        <ProfileDropdown />
      </Nav>
    </Wrapper>
  );
};
