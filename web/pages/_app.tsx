import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../providers/AuthProvider';
import { DataProvider } from '../providers/DataProvider';

// Global base styles
import theme from '../styles/theme';

const App = ({ Component, pageProps }: AppProps) => (
  <AuthProvider>
    <DataProvider>
      <ThemeProvider theme={theme}>
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
        * {
          box-sizing: border-box;
        }
      `}
        </style>
        <Component {...pageProps} />
      </ThemeProvider>
    </DataProvider>
  </AuthProvider>
);

export default App;
