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

const Home: NextPage = () => {
  const router = useRouter();
  const [urlResourceId, setUrlResourceId] = useState<string>();
  const today = useMemo(() => new Date(), []);
  const [fromTime, setFromTime] = useState<Date>(new Date());
  const [toTime, setToTime] = useState<Date>(new Date());
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const isValidDateFilter = fromTime < toTime;
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
  const [addBooking, newBookingResult] = useAddBookingMutation();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const routerResourceIds = getRouterValueString(router.query['resource']);
    setUrlResourceId(routerResourceIds);
  }, [router.query, router.isReady]);

  useEffect(() => {
    if (toTime < fromTime) {
      setToTime(fromTime);
    }
  }, [toTime, fromTime, setToTime]);

  useEffect(() => {
    if (!urlResourceId) {
      return;
    }
    fetchResource({
      variables: { id: urlResourceId },
    });
  }, [urlResourceId, fetchResource]);

  useEffect(() => {
    if (!urlResourceId || !isValidDateFilter) {
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
  }, [urlResourceId, fetchAvailability, isValidDateFilter, fromTime, toTime]);

  const loading = useMemo(
    () => resourceLoading || !router.isReady || availabilityLoading,
    [router.isReady, availabilityLoading, resourceLoading]
  );
  const error = useMemo(() => {
    if (loading) {
      return undefined;
    }
    if (!urlResourceId?.length) {
      return 'Missing query variable "resource"';
    }
    if (resourceError) {
      return resourceError.message;
    }
    if (availabilityError) {
      return availabilityError.message;
    }
    return undefined;
  }, [urlResourceId, loading, resourceError, availabilityError]);

  const schedule = useMemo(() => resource?.getResourceById?.schedule, [
    resource,
  ]);
  const formValid =
    urlResourceId &&
    !loading &&
    isValidDateFilter &&
    !availabilityLoading &&
    !!selectedSeats.length;

  const onSubmit = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!formValid || !urlResourceId) {
        return;
      }
      await addBooking({
        variables: {
          addBookingInput: {
            resourceId: urlResourceId,
            start: toGQLDate(toTime),
            end: toGQLDate(fromTime),
            seatNumbers: selectedSeats,
          },
        },
      });
    },
    [formValid, urlResourceId, toTime, fromTime, addBooking]
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
        <ScheduleCalendar schedule={resource?.getResourceById?.schedule} />
        <h2 className={styles.header}>Når vil du reservere prosjektareal?</h2>
        <div>
          {resourceLoading && <Spinner />}
          {schedule && (
            <>
              <h3 className={styles.label}>Fra dato</h3>
              <DateTimePicker
                startDate={today}
                schedule={schedule}
                onChange={setFromTime}
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
                isEndTime
              />
            </>
          )}
        </div>
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

        <Button type={'submit'} onClick={onSubmit} disabled={!formValid}>
          Reserver
        </Button>
      </main>
    </div>
  );
};

export default Home;
