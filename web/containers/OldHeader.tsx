import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { IconButton, IconType } from '../components/Icon';
import { Logo } from '../components/Logo';

export const ProfileDropdown = () => {
  const [session] = useSession();
  const router = useRouter();
  const [isOpen, setOpen] = useState<boolean>(false);
  if (!session) {
    return (
      <div>
        <IconButton
          size={20}
          icon={IconType.USER}
          onClick={() => router.push('/login')}
        />
      </div>
    );
  }
  return (
    <div>
      <IconButton
        size={20}
        icon={IconType.USER}
        onClick={() => setOpen(o => !o)}
      />
      {isOpen && (
        <div>
          <code style={{ flexDirection: 'column', marginBottom: '1rem' }}>
            <span style={{ opacity: 0.5, flex: '1' }}>{`//`} username:</span>
            {session.user.email}
          </code>
          <Link href={'/resources'}>Resources</Link>
          <Link href={'/profile'}>Profile</Link>
          <Link href={'/logout'}>Log out</Link>
        </div>
      )}
    </div>
  );
};

export const Header = () => {
  return (
    <div>
      <nav>
        <Logo />
        <ProfileDropdown />
      </nav>
    </div>
  );
};
