import React from 'react';
import NextLink from 'next/link';
import classNames from 'classnames';

type Props = { href: string; className?: string; children: React.ReactNode };
export const Link = ({ href, className, children }: Props) => {
  return (
    <NextLink href={href} passHref>
      <a
        className={classNames(
          className || 'underline hover:no-underline text-blue-800'
        )}
        href={href}>
        {children}
      </a>
    </NextLink>
  );
};
