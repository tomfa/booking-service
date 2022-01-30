import React, { useMemo, useState } from 'react';

import { matchSorter } from 'match-sorter';
import classNames from 'classnames';
import { Resource } from '../graphql/generated/types';
import { Link } from '../components/Link';
import PagerButton from './PagerButton';
import { PageTitle } from './PageTitle';

interface Props {
  title?: string;
  rows: Resource[];
  withHeader?: boolean;
  withPager?: boolean;
  onToggleDisabled?: () => void;
}

const ResourceTable = (props: Props) => {
  // TODO: Generalize to be a generic table
  const headers = ['Label', 'Category', 'Seats', 'Enabled', 'Actions'];
  const [filter, setFilter] = useState('');
  const rows = useMemo(
    () =>
      filter
        ? matchSorter(props.rows, filter, { keys: ['id', 'label', 'category'] })
        : props.rows,
    [props.rows, filter]
  );

  return (
    <div className="container">
      <div className="py-8">
        {props.withHeader && (
          <PageTitle
            title={props.title}
            onFilter={setFilter}
            buttons={[
              { href: '/resources/add', label: 'Add new' },
              { label: 'Toggle disabled', onClick: props.onToggleDisabled },
            ]}
          />
        )}

        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  {headers.map(header => {
                    return (
                      <th
                        scope="col"
                        key={header}
                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                        {header}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => {
                  return (
                    <tr
                      key={row.id}
                      className={(!row.enabled && `opacity-50`) || ''}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">
                          <p className="text-gray-900 whitespace-no-wrap">
                            <Link href={`/resources/${row.id}`}>
                              {row.label}
                            </Link>
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {row.category || ''}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {row.seats}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className="relative inline-block px-3 py-1 font-semibold leading-tight">
                          <span
                            aria-hidden
                            className={classNames(
                              'absolute inset-0 opacity-50 rounded-full',
                              {
                                'bg-green-200 text-green-900 ': row.enabled,
                                'bg-red-200 text-red-900': !row.enabled,
                              }
                            )}
                          />
                          <span className="relative">
                            {(row.enabled && 'Yes') || 'No'}
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <Link
                          className={
                            'underline hover:no-underline text-blue-800 mr-4'
                          }
                          href={`/resources/${row.id}/edit`}>
                          Edit
                        </Link>
                        <Link
                          className={
                            'underline hover:no-underline text-blue-800 mr-4'
                          }
                          href={`/resources/${row.id}/bookings`}>
                          Show bookings
                        </Link>
                        {row.enabled && (
                          <Link
                            className={
                              'underline hover:no-underline text-blue-800'
                            }
                            href={`/resources/${row.id}/bookings/add`}>
                            Add booking
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {props.withPager && (
              <div className="px-5 bg-white py-5 flex flex-col xs:flex-row items-center xs:justify-between">
                <PagerButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceTable;
