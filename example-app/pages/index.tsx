import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Dropdown } from '../components/Dropdown';
import { NextRouter, useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import Vailable, { types } from 'vailable';
import { Spinner } from '../components/Spinner';
import { DisplayError } from '../components/DisplayError';
import { MultiselectResource } from '../components/MultiselectResource';
import { Button } from '../components/Button';
import { getRouterValueList } from '../utils/router.utils';
import {
  useFindAvailabilityLazyQuery,
  useFindResourcesLazyQuery,
  useFindResourcesQuery,
} from '../graphql/generated/types';

const Home: NextPage = () => {
  const router = useRouter();
  const [selectableResourceIds, setSelectableResourceIds] = useState<string[]>(
    []
  );
  const [fromTime, setFromTime] = useState<Date>(new Date());
  const [toTime, setToTime] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 3600 * 1000)
  );
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
    console.log('Fetching resources!');
    fetchResources({
      variables: { filterResource: { resourceIds: selectableResourceIds } },
    });
  }, [selectableResourceIds, fetchResources]);

  const loading = useMemo(
    () => resourcesLoading || !router.isReady || availabilityLoading,
    [router.isReady, availabilityLoading, resourcesLoading, resources]
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

  if (error) {
    return <DisplayError>{error}</DisplayError>;
  }

  if (loading) {
    return <Spinner />;
  }

  console.log('resources');
  console.log(resources);

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
          <Dropdown options={{ '5': 'a', '6': 'b' }} />
        </div>
        <h2 className={styles.header}>Hvilke soner?</h2>
        <Button
          onClick={() => {
            console.log('book!');
          }}>
          Reserver
        </Button>
      </main>
    </div>
  );
};

export default Home;
