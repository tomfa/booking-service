import { Provider as NextAuthProvider, useSession } from 'next-auth/client';

import { ThemeProvider } from 'styled-components';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import { useMemo } from 'react';
import { AppProps } from 'next/app';
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

const AuthedApp = (props: AppProps) => {
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
      <props.Component {...props.pageProps} />
    </ApolloProvider>
  );
};

const App = (props: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <MessageProvider>
        <NextAuthProvider session={props.pageProps.session}>
          <AuthedApp {...props} />
        </NextAuthProvider>
      </MessageProvider>
    </ThemeProvider>
  );
};

export default App;
