import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';

// Global base styles
import theme from '../styles/theme';
import { AuthProvider } from '../providers/AuthProvider';

const App = ({ Component, pageProps }: AppProps) => (
  <AuthProvider>
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
  </AuthProvider>
);

export default App;
