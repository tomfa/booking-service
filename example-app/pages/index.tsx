import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DisplayError } from '../components/DisplayError';
import { Button } from '../components/Button';
import { getRouterValueString } from '../utils/router.utils';
import {
  useAddBookingMutation,
  useFindAvailabilityLazyQuery,
  useGetResourceByIdLazyQuery,
} from '../graphql/generated/types';
import { ResourceSeatSelector } from '../container/ResourceSeatSelector';
import DateTimePicker from '../components/DateTimePicker/DateTimePicker';
import { Spinner } from '../components/Spinner';
import { toGQLDate } from '../utils/date.utils';
import { ScheduleCalendar } from '../components/ScheduleCalendar';
import { BookingConfirmation } from '../components/BookingConfirmation';

const Home: NextPage = () => {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [fromTime, setFromTime] = useState<Date>(new Date());
  const [toTime, setToTime] = useState<Date>();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const isValidDateFilter = toTime && fromTime < toTime;
  const urlResourceId = useMemo(
    () => router.isReady && getRouterValueString(router.query['resource']),
    [router]
  );

  const [
    fetchResource,
    { data: resource, loading: resourceLoading, error: resourceError },
  ] = useGetResourceByIdLazyQuery();
  const [
    fetchAvailability,
    {
      data: availability,
      loading: availabilityLoading,
      error: availabilityError,
    },
  ] = useFindAvailabilityLazyQuery({ fetchPolicy: 'network-only' });
  const [
    addBooking,
    {
      data: addBookingData,
      loading: addBookingLoading,
      error: addBookingError,
    },
  ] = useAddBookingMutation();
  const reloadAvailability = useCallback(() => {
    if (!fromTime || !toTime || !urlResourceId || !isValidDateFilter) {
      return;
    }
    const variables = {
      filterAvailability: {
        resourceIds: [urlResourceId],
        from: toGQLDate(fromTime),
        to: toGQLDate(toTime),
      },
    };
    fetchAvailability({ variables });
  }, [urlResourceId, fromTime, toTime, isValidDateFilter, fetchAvailability]);

  useEffect(() => {
    if (!urlResourceId) {
      return;
    }
    fetchResource({
      variables: { id: urlResourceId },
    });
  }, [urlResourceId, fetchResource]);

  useEffect(() => {
    reloadAvailability();
  }, [urlResourceId, reloadAvailability, isValidDateFilter, fromTime, toTime]);

  const loading = useMemo(
    () => resourceLoading || !router.isReady || availabilityLoading,
    [router.isReady, availabilityLoading, resourceLoading]
  );
  const error = useMemo(() => {
    if (loading) {
      return undefined;
    }
    if (resource?.getResourceById === null) {
      return `Unable to find resource ${urlResourceId}`;
    }
    if (!urlResourceId) {
      return 'Missing query variable "resource"';
    }
    if (resourceError) {
      return resourceError.message;
    }
    if (availabilityError) {
      return availabilityError.message;
    }
    return undefined;
  }, [resource, urlResourceId, loading, resourceError, availabilityError]);

  const schedule = useMemo(() => resource?.getResourceById?.schedule, [
    resource,
  ]);
  const formValid =
    urlResourceId &&
    !loading &&
    isValidDateFilter &&
    !availabilityLoading &&
    !!toTime &&
    !!selectedSeats.length;

  const onSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!formValid || !urlResourceId || !toTime) {
        return;
      }
      addBooking({
        variables: {
          addBookingInput: {
            resourceId: urlResourceId,
            start: toGQLDate(fromTime),
            end: toGQLDate(toTime),
            seatNumbers: selectedSeats,
          },
        },
      })
        .catch(err => {
          // errors will be displayed from addBookingError
        })
        .finally(reloadAvailability);
    },
    [
      reloadAvailability,
      formValid,
      urlResourceId,
      addBooking,
      fromTime,
      toTime,
      selectedSeats,
    ]
  );

  if (error) {
    return <DisplayError>{error}</DisplayError>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Booking</title>
        <meta name="description" content="Booking" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h2 className={styles.header}>
          Når vil du reservere{' '}
          {resource?.getResourceById?.label?.toLowerCase() || 'prosjektareal'}?
        </h2>
        <ScheduleCalendar schedule={resource?.getResourceById?.schedule} />
        <div>
          {resourceLoading && <Spinner />}
          {schedule && (
            <>
              <h3 className={styles.label}>Fra dato</h3>
              <DateTimePicker
                startDate={today}
                schedule={schedule}
                onChange={setFromTime}
                numDaysAheadAvailable={180}
              />
            </>
          )}
          {schedule && fromTime && (
            <>
              <h3 className={styles.label}>Til dato</h3>
              <DateTimePicker
                startDate={fromTime}
                schedule={schedule}
                onChange={setToTime}
                numDaysAheadAvailable={31}
                isEndTime
              />
            </>
          )}
        </div>
        {toTime && toTime < fromTime && (
          <p>
            <DisplayError>Til dato må være etter fra dato</DisplayError>
          </p>
        )}
        <h2 className={styles.header}>Hvilke soner?</h2>
        <ResourceSeatSelector
          start={fromTime}
          end={toTime}
          resource={resource?.getResourceById}
          isLoading={loading}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
          slots={(isValidDateFilter && availability?.findAvailability) || []}
        />

        {!!addBookingError && (
          <DisplayError>{addBookingError.message}</DisplayError>
        )}
        {!!addBookingData?.addBooking && (
          <BookingConfirmation
            booking={addBookingData.addBooking}
            updateAvailability={reloadAvailability}
          />
        )}

        <Button
          type={'submit'}
          onClick={onSubmit}
          disabled={!formValid || addBookingLoading}>
          {addBookingLoading && <Spinner />}
          {!addBookingLoading && 'Reserver'}
        </Button>
      </main>
    </div>
  );
};

export default Home;
