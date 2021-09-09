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

const getRouterValueList = (
  queryValue: string | string[] | undefined
): string[] => {
  if (!queryValue) {
    return [];
  }
  if (typeof queryValue === 'string') {
    return [queryValue];
  }
  return queryValue;
};

const getRouterValueString = (
  queryValue: string | string[] | undefined
): string | undefined => {
  if (!queryValue) {
    return undefined;
  }
  if (typeof queryValue === 'string') {
    return queryValue;
  }
  return queryValue[0];
};

const Home: NextPage = () => {
  const router = useRouter();
  const [selectableResourceIds, setSelectableResourceIds] = useState<string[]>(
    []
  );
  const [authenticationKey, setAuthenticationKey] = useState<string>();
  const [api, setAPI] = useState<Vailable>();
  const [resources, setResources] = useState<types.Resource[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const routerResourceIds = getRouterValueList(router.query['resources']);
    const authkey = getRouterValueString(router.query['auth']);

    setSelectableResourceIds(routerResourceIds);
    setAuthenticationKey(authkey);

    if (authkey) {
      const API = new Vailable({ token: authkey });
      setAPI(API);
    }
  }, [router.query, router.isReady]);

  useEffect(() => {
    const fetchResources = async () => {
      if (!api) {
        return;
      }
      const resources = await api.findResources();
      setResources(resources);
    };
    fetchResources();
  }, [api]);

  useEffect(() => {
    const isLoading = !router.isReady;
    setLoading(isLoading);
  }, [router.isReady, resources]);

  const error = useMemo(() => {
    if (loading) {
      return undefined;
    }
    if (!authenticationKey) {
      return 'Missing query variable "auth"';
    }
    if (!selectableResourceIds?.length) {
      return 'Missing query variable "resource"';
    }
    if (!api) {
      return 'Error initializing API';
    }
    return undefined;
  }, [authenticationKey, selectableResourceIds, loading, api]);

  const resourceAvailability = useMemo(() => {
    return (
      resources?.map(r => ({
        resource: r,
        available: true,
        checked: false,
      })) || []
    );
  }, [resources]);

  if (error) {
    return <DisplayError>{error}</DisplayError>;
  }

  if (loading) {
    return <Spinner />;
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
          <Dropdown options={{ '5': 'a', '6': 'b' }} />
        </div>
        <h2 className={styles.header}>Hvilke soner?</h2>
        <MultiselectResource resources={resourceAvailability} />
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
