import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export const NavLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: string | React.ReactNode;
  className?: string;
}) => {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link href={href} passHref>
      <a
        className={classNames(
          'hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md font-medium',
          'block text-base md:text-sm',
          (isActive && 'text-gray-800') || 'text-gray-500',
          className
        )}
        href={href}>
        {children}
      </a>
    </Link>
  );
};
