import { AppProps } from 'next/app';
import { Provider as NextAuthProvider, useSession } from 'next-auth/client';

import { ThemeProvider } from 'styled-components';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { useMemo } from 'react';
import { MessageProvider } from '../providers/MessageProvider';

import theme from '../styles/theme';

const getClient = (authorization?: string) => {
  const headers = authorization ? { authorization } : undefined;
  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV === 'development' && !!headers,
    headers,
  });
};

const AuthedApp = ({ Component, pageProps }: AppProps) => {
  const [session] = useSession();
  const client = useMemo(() => getClient(session?.apiToken), [session]);
  return (
    <ApolloProvider client={client}>
      <style>
        {`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: ${theme.fonts.primary};
          background-color: ${theme.colors.bgPrimary};
          color: ${theme.colors.textPrimary};
        }
        a {
          color: ${theme.colors.textPrimary};
        }
        * {
          box-sizing: border-box;
        }
      `}
      </style>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <MessageProvider>
        <NextAuthProvider session={pageProps.session}>
          <AuthedApp Component={Component} pageProps={pageProps} />
        </NextAuthProvider>
      </MessageProvider>
    </ThemeProvider>
  );
};

export default App;
