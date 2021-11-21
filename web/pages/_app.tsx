// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css';

import { Provider as NextAuthProvider, useSession } from 'next-auth/client';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { useMemo } from 'react';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const getClient = (authorization?: string) => {
  const headers = authorization ? { authorization } : undefined;
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV === 'development' && !!headers,
    headers,
  });
};

const AuthedApp = (props: AppProps) => {
  const [session] = useSession();
  const client = useMemo(() => getClient(session?.apiToken), [session]);
  return (
    <ApolloProvider client={client}>
      <props.Component {...props.pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        closeOnClick
        pauseOnHover
      />
    </ApolloProvider>
  );
};

const App = (props: AppProps) => {
  return (
    <NextAuthProvider session={props.pageProps.session}>
      <AuthedApp {...props} />
    </NextAuthProvider>
  );
};

export default App;
