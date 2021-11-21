import { useSession } from 'next-auth/client';
import { useMemo } from 'react';
import { Icon, IconType } from '../Icon';
import DropDownMenu from './DropdownMenu';

export const LoginMenu = () => {
  const [session] = useSession();
  const menuItems = useMemo(() => {
    if (!session) {
      return [{ link: '/login', label: 'Login' }];
    }
    return [
      { link: '/resources', label: 'Resources' },
      { link: '/resources/add', label: 'Add resource' },
      { link: '/profile', label: 'Profile' },
      { link: '/logout', label: 'Log out' },
    ];
  }, [session]);
  return (
    <DropDownMenu
      items={menuItems}
      icon={<Icon size={20} icon={IconType.USER} />}
    />
  );
};
