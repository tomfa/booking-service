import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getRouterValueString } from '../utils/router.utils';
import { Spinner } from '../components/Spinner';
import { DisplayError } from '../components/DisplayError';

const getClient = (authorization?: string) => {
  const headers = authorization ? { authorization } : undefined;
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV === 'development' && !!headers,
    headers,
  });
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [authenticationKey, setAuthenticationKey] = useState<string>();
  const authKey = useMemo(() => getRouterValueString(router.query['auth']), [
    router.query,
  ]);
  const error = useMemo(() => {
    if (router.isReady && !authKey) {
      return 'query parameter "auth" missing"';
    }
  }, [router.isReady, authKey]);

  useEffect(() => {
    if (!authKey) {
      return;
    }
    setAuthenticationKey(authKey);
  }, [authKey]);

  const client = useMemo(
    () => authenticationKey && getClient(authenticationKey),
    [authenticationKey]
  );

  if (error) {
    return <DisplayError>{error}</DisplayError>;
  }

  if (!client) {
    return <Spinner />;
  }

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default MyApp;
