import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export const theme = {
  fonts: {
    primary:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\n' +
      '    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    secondary: "'Barlow Condensed', sans-serif",
  },
  colors: {
    primary: '#e3c346',
    secondary: '',
    bgPrimary: '#3a3a3a',
    bgSecondary: '#white',
    textPrimary: '#FFFFFF',
    textSecondary: '#3a3a3a',
    links: '#0070f3',
  },
  layout: {
    maxWidth: '800',
  },
};

export const useTheme = (): typeof theme => {
  const themeContext = useContext(ThemeContext);
  return (themeContext as unknown) as typeof theme;
};

export default theme;
