import React from 'react';
import classNames from 'classnames';
import { Resource } from '../graphql/generated/types';
import { Icon, IconType } from '../components/Icon';
import { Link } from '../components/Link';

interface Props {
  resource: Resource;
}

const EnabledIcon = ({ enabled }: { enabled: boolean }) => {
  if (enabled) {
    return (
      <Icon
        size={20}
        icon={IconType.CHECK}
        className={'inline text-green-700 mr-2'}
      />
    );
  }
  return (
    <Icon
      size={20}
      icon={IconType.CLOSE}
      className={'inline text-red-700 mr-2'}
    />
  );
};

const ResourceDetails = ({ resource }: Props) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex">
            <EnabledIcon enabled={resource.enabled} />
            <span>Resource: {resource.label}</span>
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            id: {resource.id}
          </p>
        </div>
        <div>
          <Link
            href={`/resources/${resource.id}/bookings/add`}
            className={classNames(
              'inline-block py-2 px-3 bg-gray-100 text-sm shadow-lg ml-auto',
              {
                'opacity-50': !resource.enabled,
                'hover:bg-gray-200': resource.enabled,
              }
            )}>
            Add booking
          </Link>
          <Link
            href={`/resources/${resource.id}/edit`}
            className="inline-block py-2 px-3 bg-gray-100 text-sm hover:bg-gray-200 shadow-lg ml-auto ml-1">
            Edit
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Bookings</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              <Link
                href={`/resources/${resource.id}/bookings`}
                className="text-sm text-blue-700 hover:underline">
                Display bookings
              </Link>
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Label</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              {resource.label}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Number of seats
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              {resource.seats}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd
              className={classNames(
                'mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3',
                {
                  'text-red-700': !resource.enabled,
                }
              )}>
              {resource.enabled ? 'Enabled' : 'disabled'}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              {resource.category}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Timezone</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              {resource.timezone}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Schedule</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              <dt className="text-sm font-medium text-gray-500">
                Schedule Monday
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
                <p>
                  {resource.schedule.mon.start} - {resource.schedule.mon.end}
                </p>
                <small>
                  {resource.schedule.mon.slotDurationMinutes} minute slots,
                  bookable every {resource.schedule.mon.slotIntervalMinutes}{' '}
                  minutes
                </small>
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Schedule Tuesday
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
                {resource.schedule.tue.start} - {resource.schedule.tue.end}
                {resource.schedule.tue.start && (
                  <small>
                    {resource.schedule.tue.slotDurationMinutes} minute slots,
                    bookable every {resource.schedule.tue.slotIntervalMinutes}{' '}
                    minutes
                  </small>
                )}
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Schedule Wednesday
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
                {resource.schedule.wed.start} - {resource.schedule.wed.end}
                {resource.schedule.wed.start && (
                  <small>
                    {resource.schedule.wed.slotDurationMinutes} minute slots,
                    bookable every {resource.schedule.wed.slotIntervalMinutes}{' '}
                    minutes
                  </small>
                )}
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Schedule Thursday
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
                {resource.schedule.thu.start} - {resource.schedule.thu.end}
                {resource.schedule.thu.start && (
                  <small>
                    {resource.schedule.thu.slotDurationMinutes} minute slots,
                    bookable every {resource.schedule.thu.slotIntervalMinutes}{' '}
                    minutes
                  </small>
                )}
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Schedule Friday
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
                {resource.schedule.fri.start} - {resource.schedule.fri.end}
                {resource.schedule.fri.start && (
                  <small>
                    {resource.schedule.fri.slotDurationMinutes} minute slots,
                    bookable every {resource.schedule.fri.slotIntervalMinutes}{' '}
                    minutes
                  </small>
                )}
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Schedule Saturday
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
                {resource.schedule.sat.start} - {resource.schedule.sat.end}
                {resource.schedule.sat.start && (
                  <small>
                    {resource.schedule.sat.slotDurationMinutes} minute slots,
                    bookable every {resource.schedule.sat.slotIntervalMinutes}{' '}
                    minutes
                  </small>
                )}
              </dd>
              <dt className="text-sm font-medium text-gray-500">
                Schedule Sunday
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {resource.schedule.sun.start} - {resource.schedule.sun.end}
                {resource.schedule.sun.start && (
                  <small>
                    {resource.schedule.sun.slotDurationMinutes} minute slots,
                    bookable every {resource.schedule.sun.slotIntervalMinutes}{' '}
                    minutes
                  </small>
                )}
              </dd>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ResourceDetails;
