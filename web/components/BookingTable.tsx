import React, { useCallback, useMemo, useState } from 'react';

import Link from 'next/link';
import { matchSorter } from 'match-sorter';
import classNames from 'classnames';
import {
  Booking,
  useCancelBookingMutation,
  useGetResourceByIdQuery,
} from '../graphql/generated/types';
import { PageTitle } from '../kit/PageTitle';
import PagerButton from '../kit/PagerButton';
import { displayDate, fromGQLDate } from '../utils/date.utils';
import { IconButton, IconType } from './Icon';
import { DisplayError } from './DisplayError';

interface Props {
  title?: string;
  rows: Booking[];
  resourceId: string;
  withHeader?: boolean;
  withPager?: boolean;
  onToggleDisabled?: () => void;
}

const BookingTable = (props: Props) => {
  // TODO: Generalize to be a generic table
  const headers = ['userId', 'Resource', 'Start', 'End', ''];
  const [filter, setFilter] = useState('');
  const [
    deleteBooking,
    {
      data: cancelBookingData,
      loading: cancelBookingLoading,
      error: cancelBookingError,
    },
  ] = useCancelBookingMutation();

  const { data: resource, error: getResourceError } = useGetResourceByIdQuery({
    variables: { id: props.resourceId },
  });

  const cancelBooking = useCallback(
    (id: string) => deleteBooking({ variables: { id } }),
    [deleteBooking]
  );
  const rows = useMemo(
    () =>
      filter
        ? matchSorter(props.rows, filter, {
            keys: ['resource.label', 'userId'],
          })
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
              {
                label: 'Add booking',
                href: `/resources/${props.resourceId}/bookings/add`,
              },
              { label: 'Toggle canceled', onClick: props.onToggleDisabled },
            ]}
          />
        )}
        {cancelBookingError && (
          <DisplayError>{cancelBookingError.message}</DisplayError>
        )}

        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  {headers.map((header, i) => {
                    return (
                      <th
                        scope="col"
                        /* eslint-disable-next-line react/no-array-index-key */
                        key={i}
                        className={classNames(
                          'px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal',
                          { 'font-bold': i === 0 }
                        )}>
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
                      className={(row.canceled && `opacity-50`) || ''}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">
                          <p className="text-gray-900 whitespace-no-wrap">
                            <Link href={`/bookings/${row.id}`} passHref>
                              <a
                                className="underline hover:no-underline font-bold"
                                href={`/bookings/${row.id}`}>
                                {row.userId || '[no userId]'}
                              </a>
                            </Link>
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">
                          <p className="text-gray-900 whitespace-no-wrap">
                            <Link
                              href={`/resources/${row.resourceId}`}
                              passHref>
                              <a
                                className="underline hover:no-underline"
                                href={`/`}>
                                {row.resource.label}
                              </a>
                            </Link>
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {displayDate(
                            fromGQLDate(row.start),
                            row.resource.timezone
                          )}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className="relative inline-block px-3 py-1 text-green-900 leading-tight">
                          <span
                            aria-hidden
                            className={classNames(
                              'absolute inset-0 opacity-50 rounded-full'
                            )}
                          />
                          <span className="relative">
                            {displayDate(
                              fromGQLDate(row.end),
                              row.resource.timezone
                            )}
                          </span>
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {!row.canceled && (
                          <IconButton
                            className={'text-red-600 p-2 hover:bg-gray-100'}
                            size={14}
                            icon={IconType.REMOVE}
                            onClick={() => cancelBooking(row.id)}
                          />
                        )}
                        {row.canceled && (
                          <IconButton
                            className={'p-2'}
                            size={14}
                            icon={IconType.ARCHIVE}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
                {!rows.length && (
                  <tr>
                    <td
                      colSpan={100}
                      className={
                        'px-5 py-5 border-b border-gray-200 bg-white text-sm opacity-50'
                      }>
                      No bookings found.{' '}
                      <Link
                        href={`/resources/${props.resourceId}/bookings/add`}
                        passHref>
                        <a className={'underline hover:no-underline'} href="/">
                          Add a booking
                        </a>
                      </Link>
                    </td>
                  </tr>
                )}
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

export default BookingTable;
