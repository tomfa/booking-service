import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Dropdown } from '../components/Dropdown';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { DisplayError } from '../components/DisplayError';
import { Button } from '../components/Button';
import { getRouterValueList } from '../utils/router.utils';
import {
  useFindAvailabilityLazyQuery,
  useFindResourcesLazyQuery,
} from '../graphql/generated/types';
import { ResourceSelector } from '../container/ResourceSelector';
import DateTimePicker from '../components/DateTimePicker/DateTimePicker';
import { Spinner } from '../components/Spinner';
import { toGQLDate } from '../utils/date.utils';

const Home: NextPage = () => {
  const router = useRouter();
  const [selectableResourceIds, setSelectableResourceIds] = useState<string[]>(
    []
  );
  const today = useMemo(() => new Date(), []);
  const [fromTime, setFromTime] = useState<Date>(new Date());
  const [toTime, setToTime] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 3600 * 1000)
  );
  const isValidDateFilter = fromTime < toTime;
  const [
    fetchResources,
    { data: resources, loading: resourcesLoading, error: resourcesError },
  ] = useFindResourcesLazyQuery();
  const [
    fetchAvailability,
    {
      data: availability,
      loading: availabilityLoading,
      error: availabilityError,
    },
  ] = useFindAvailabilityLazyQuery();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const routerResourceIds = getRouterValueList(router.query['resources']);
    setSelectableResourceIds(routerResourceIds);
  }, [router.query, router.isReady]);

  useEffect(() => {
    if (toTime < fromTime) {
      setToTime(fromTime);
    }
  }, [toTime, fromTime, setToTime]);

  useEffect(() => {
    if (!selectableResourceIds) {
      return;
    }
    fetchResources({
      variables: { filterResource: { resourceIds: selectableResourceIds } },
    });
  }, [selectableResourceIds, fetchResources]);

  useEffect(() => {
    if (!selectableResourceIds || !isValidDateFilter) {
      return;
    }
    fetchAvailability({
      variables: {
        filterAvailability: {
          resourceIds: selectableResourceIds,
          from: toGQLDate(fromTime),
          to: toGQLDate(toTime),
        },
      },
    });
  }, [selectableResourceIds, fetchAvailability, isValidDateFilter]);

  const loading = useMemo(
    () => resourcesLoading || !router.isReady || availabilityLoading,
    [router.isReady, availabilityLoading, resourcesLoading]
  );
  const error = useMemo(() => {
    if (loading) {
      return undefined;
    }
    if (!selectableResourceIds?.length) {
      return 'Missing query variable "resource"';
    }
    if (resourcesError) {
      return resourcesError.message;
    }
    if (availabilityError) {
      return availabilityError.message;
    }
    return undefined;
  }, [selectableResourceIds, loading, resourcesError, availabilityError]);

  const schedule = useMemo(() => resources?.findResources?.[0]?.schedule, [
    resources,
  ]);

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
        <h2 className={styles.header}>Når vil du reservere prosjektareal?</h2>
        <div>
          {resourcesLoading && <Spinner />}
          {schedule && (
            <>
              <h3 className={styles.label}>Fra dato</h3>
              <DateTimePicker
                startDate={today}
                intervalMinutes={15}
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
                intervalMinutes={15}
                schedule={schedule}
                onChange={setToTime}
              />
            </>
          )}
        </div>
        <h2 className={styles.header}>Hvilke soner?</h2>
        <ResourceSelector
          start={fromTime}
          end={toTime}
          resource={resources?.findResources?.[0]}
          isLoading={loading}
          slots={(isValidDateFilter && availability?.findAvailability) || []}
        />

        <Button
          onClick={() => {
            console.log('book!');
          }}
          disabled={loading}>
          Reserver
        </Button>
      </main>
    </div>
  );
};

export default Home;