import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getRouterValueString } from '../utils/router.utils';
import { Spinner } from '../components/Spinner';

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

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const authkey = getRouterValueString(router.query['auth']);
    setAuthenticationKey(authkey);
  }, [router.query, router.isReady]);

  const client = useMemo(
    () => authenticationKey && getClient(authenticationKey),
    [authenticationKey]
  );

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
