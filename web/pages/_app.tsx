import { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';

import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MessageProvider } from '../providers/MessageProvider';

import theme from '../styles/theme';

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <MessageProvider>
      <Provider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </Provider>
    </MessageProvider>
  </ThemeProvider>
);

export default App;
