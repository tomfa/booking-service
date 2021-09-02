import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

import { ThemeProvider } from 'styled-components';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MessageProvider } from '../providers/MessageProvider';

import theme from '../styles/theme';
import { config } from '../config';

const client = new ApolloClient({
  uri: config.GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <MessageProvider>
      <Provider session={pageProps.session}>
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
      </Provider>
    </MessageProvider>
  </ThemeProvider>
);

export default App;
