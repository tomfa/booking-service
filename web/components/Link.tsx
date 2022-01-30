import React from 'react';
import NextLink from 'next/link';
import classNames from 'classnames';

type Props = {
  href: string;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;
export const Link = ({ href, className, children, ...rest }: Props) => {
  return (
    <NextLink href={href} passHref>
      <a
        className={classNames(
          className || 'underline hover:no-underline text-blue-800'
        )}
        href={href}
        {...rest}>
        {children}
      </a>
    </NextLink>
  );
};
