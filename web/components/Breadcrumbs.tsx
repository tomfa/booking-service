import { ChevronRightIcon } from '@heroicons/react/solid';
import React from 'react';
import classNames from 'classnames';
import { Link } from './Link';
import { NavLinkData } from './utils/navigation.utils';

type Props = {
  links: Array<NavLinkData>;
};
export default function Breadcrumbs(props: Props) {
  return (
    <nav className="flex py-6" aria-label="Breadcrumb">
      <ol
        className={classNames(
          'flex space-x-4 md:items-center flex-col md:flex-row'
        )}>
        {props.links.map((link, i) => (
          <li key={link.name} className={'py-1 md:py-0'}>
            <div className="flex items-center">
              {i !== 0 && (
                <ChevronRightIcon
                  className="flex-shrink-0 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              )}
              {link.href && i !== props.links.length - 1 ? (
                <Link
                  href={link.href}
                  className={classNames(
                    'text-sm font-medium text-gray-800 hover:underline hover:opacity-100',
                    {
                      'ml-4': i !== 0,
                      'opacity-50': i !== props.links.length - 1,
                    }
                  )}
                  aria-current={link.current ? 'page' : undefined}>
                  {link.name}
                </Link>
              ) : (
                <span
                  className={classNames('text-sm font-medium text-gray-800', {
                    'ml-4': i !== 0,
                  })}>
                  {link.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
