import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../providers/AuthProvider';

import theme from '../styles/theme';
import { MessageProvider } from '../providers/MessageProvider';

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <MessageProvider>
      <AuthProvider>
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
      </AuthProvider>
    </MessageProvider>
  </ThemeProvider>
);

export default App;
