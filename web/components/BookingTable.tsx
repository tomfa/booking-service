import React, { useCallback, useMemo, useState } from 'react';

import { matchSorter } from 'match-sorter';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { Booking, useCancelBookingMutation } from '../graphql/generated/types';
import { PageTitle } from '../kit/PageTitle';
import PagerButton from '../kit/PagerButton';
import { fromGQLDate } from '../utils/date.utils';
import { displaySeats } from '../utils/booking.utils';
import { IconButton, IconType } from './Icon';
import { DisplayError } from './DisplayError';
import { Link } from './Link';

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
  const headers = ['userId', 'Resource', 'Start', 'End', 'Seat', ''];
  const [filter, setFilter] = useState('');
  const [
    deleteBooking,
    { error: cancelBookingError },
  ] = useCancelBookingMutation();

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
                            <Link
                              href={`/bookings/${row.id}`}
                              className="underline hover:no-underline font-bold">
                              {row.userId || '[no userId]'}
                            </Link>
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex items-center">
                          <p className="text-gray-900 whitespace-no-wrap">
                            <Link href={`/resources/${row.resourceId}`}>
                              {row.resource.label}
                            </Link>
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <DateCell
                          gqlDate={row.start}
                          tz={row.resource.timezone}
                        />
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <DateCell
                          gqlDate={row.end}
                          tz={row.resource.timezone}
                        />
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {displaySeats(row.seatNumbers)}
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
                            onClick={() => {}}
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
                        className={'underline hover:no-underline'}>
                        Add a booking
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

const DateCell = ({ gqlDate, tz }: { gqlDate: number; tz: string }) => {
  const date = dayjs(fromGQLDate(gqlDate), tz);

  return (
    <>
      <span className="block">{date.format('YYYY-MM-DD')}</span>
      <span className="block">{date.format('HH:mm')}</span>
    </>
  );
};

export default BookingTable;
