import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../providers/AuthProvider';
import { DataProvider } from '../providers/DataProvider';

// Global base styles
import theme from '../styles/theme';
import { MessageProvider } from '../providers/MessageProvider';
import { PDFProvider } from '../providers/PDFProvider';

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={theme}>
    <MessageProvider>
      <AuthProvider>
        <DataProvider>
          <PDFProvider>
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
          color: ${theme.colors.links};
        }
        * {
          box-sizing: border-box;
        }
      `}
            </style>
            <Component {...pageProps} />
          </PDFProvider>
        </DataProvider>
      </AuthProvider>
    </MessageProvider>
  </ThemeProvider>
);

export default App;
