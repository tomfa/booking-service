import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Logo } from '../components/Logo';
import { IconButton, IconType } from '../components/Icon';
import { Code } from '../components/Code.styles';
import { Nav, Wrapper } from './Header.styles';
import {
  ProfileDropdownMenu,
  ProfileDropdownWrapper,
} from './ProfileDropdown.styles';

export const ProfileDropdown = () => {
  const [session] = useSession();
  const router = useRouter();
  const [isOpen, setOpen] = useState<boolean>(false);
  if (!session) {
    return (
      <ProfileDropdownWrapper>
        <IconButton
          size={20}
          icon={IconType.USER}
          onClick={() => router.push('/login')}
        />
      </ProfileDropdownWrapper>
    );
  }
  return (
    <ProfileDropdownWrapper>
      <IconButton
        size={20}
        icon={IconType.USER}
        onClick={() => setOpen(o => !o)}
      />
      {isOpen && (
        <ProfileDropdownMenu>
          <Code style={{ flexDirection: 'column', marginBottom: '1rem' }}>
            <span style={{ opacity: 0.5, flex: '1' }}>{`//`} username:</span>
            {session.user.email}
          </Code>
          <Link href={'/resources'}>Resources</Link>
          <Link href={'/profile'}>Profile</Link>
          <Link href={'/logout'}>Log out</Link>
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
