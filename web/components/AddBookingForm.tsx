import React from 'react';
import { Resource, TimeSlot } from '../graphql/generated/types';
import BookingCalendar from './BookingCalendar';
import { DisplayError } from './DisplayError';
import { Link } from './Link';
import { Route } from './utils/navigation.utils';

type Props = { resource: Resource; availableSlots?: TimeSlot[] | null };
export default function AddBookingForm({ resource, availableSlots }: Props) {
  if (!resource.enabled) {
    return (
      <DisplayError>
        <>
          This resource is not enabled for booking. Update it{' '}
          <Link href={Route.editResource(resource.id)}>here</Link>
        </>
      </DisplayError>
    );
  }
  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between border-b border-gray-200">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex">
              <span>Add booking </span>
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              <Link href={Route.resources(resource.id)}>
                Resource: {resource.label}
              </Link>
              <span> – {resource.seats} seats</span>
              <span> – {resource.timezone}</span>
            </p>
          </div>
        </div>

        {availableSlots && (
          <BookingCalendar resource={resource} availability={availableSlots} />
        )}
      </div>
    </>
  );
}
