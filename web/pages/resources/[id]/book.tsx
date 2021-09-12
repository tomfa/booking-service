import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Booking,
  Resource,
  TimeSlot,
  useAddBookingMutation,
  useFindAvailabilityLazyQuery,
  useFindResourcesQuery,
} from '../../../graphql/generated/types';
import { Layout } from '../../../components/Layout';

const formatGQLTime = (time: number) =>
  new Date(time * 1000).toISOString().substring(10, 16).replace('T', ' ');
const gQLTimeToDateString = (time: number) =>
  new Date(time * 1000).toISOString().substring(0, 10);

const BookingConfirmation = ({ booking }: { booking: Booking }) => {
  return (
    <p>
      Seats {booking.seatNumbers.join(', ')} booked{' '}
      {gQLTimeToDateString(booking.start)} at {formatGQLTime(booking.start)}
    </p>
  );
};

const BookableTimeSlot = ({
  timeslot,
  onClick,
}: {
  timeslot: TimeSlot;
  onClick: (slot: TimeSlot) => void;
}) => {
  const startTime = formatGQLTime(timeslot.start);
  const endTime = formatGQLTime(timeslot.end);
  if (timeslot.availableSeats <= 0) {
    return (
      <li>
        {startTime} - {endTime} (opptatt)
      </li>
    );
  }
  return (
    <li>
      <button onClick={() => onClick(timeslot)}>
        {startTime} - {endTime}
      </button>
    </li>
  );
};

const BookingCalendar = ({
  availability,
  resource,
}: {
  availability: TimeSlot[];
  resource: Resource;
}) => {
  const [bookingMutation, bookingResult] = useAddBookingMutation();
  const days: Record<string, TimeSlot[]> = {};
  availability.forEach(t => {
    const dateStr = gQLTimeToDateString(t.start);
    if (!days[dateStr]) {
      days[dateStr] = [];
    }
    days[dateStr].push(t);
  });
  const bookTimeSlot = useCallback(
    (timeslot: TimeSlot) =>
      bookingMutation({
        variables: {
          addBookingInput: {
            resourceId: resource.id,
            start: timeslot.start,
          },
        },
      }),
    [bookingMutation, resource]
  );
  if (bookingResult.loading) {
    return <div>laster</div>;
  }
  if (bookingResult.data?.addBooking) {
    return (
      <div>
        <h3>Booking added</h3>
        <BookingConfirmation booking={bookingResult.data.addBooking} />
      </div>
    );
  }
  return (
    <div>
      {Object.entries(days).map(([label, slots]) => {
        return (
          <div key={label}>
            <h3>{label}</h3>
            <ul>
              {slots.map(s => (
                <BookableTimeSlot
                  timeslot={s}
                  key={s.start}
                  onClick={bookTimeSlot}
                />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default function BookingPage() {
  const router = useRouter();

  const findResources = useFindResourcesQuery({
    variables: { filterResource: {} },
  });
  const resource: Resource | undefined = useMemo(
    () => findResources.data?.findResources.find(r => r.id === router.query.id),
    [router.query, findResources.data]
  );
  const [fetchAvailability, { data }] = useFindAvailabilityLazyQuery();
  useEffect(
    () =>
      resource &&
      fetchAvailability({
        variables: { filterAvailability: { resourceIds: [resource.id] } },
      }),
    [resource, fetchAvailability]
  );

  return (
    <Layout social={{ title: 'Vailable | Resource' }}>
      {!resource && <>Loading...</>}
      {resource && !resource.enabled && (
        <>This resource is not available for booking</>
      )}
      {resource && (
        <div>
          <h3>{resource.label}</h3>
          <Link href={`/resources/${resource.id}`}>Back</Link>
          <ul>
            <li>Status: {(!resource.enabled && 'Disabled') || 'Enabled'}</li>
            <li>Seats: {resource.seats}</li>
            <li>Category: {resource.category || '(Not set)'}</li>
          </ul>
        </div>
      )}
      {data?.findAvailability && (
        <BookingCalendar
          resource={resource}
          availability={data?.findAvailability}
        />
      )}
    </Layout>
  );
}
