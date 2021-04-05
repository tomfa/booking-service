export const theme = {
  fonts: {
    primary:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\n' +
      '    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    secondary: "'Barlow Condensed', sans-serif",
  },
  z: {
    normal: 0,
    below: -10,
    above: 5,
    top: 10,
  },
  colors: {
    primary: '#8BA02A',
    secondary: '#C6A666',
    bgPrimary: '#232828',
    bgSecondary: '#FAFAFA',
    textPrimary: '#FFFFFF',
    textSecondary: '#000000',
    links: '#0070f3',

    muted: '#7d7777',
    success: '#139113',
    bgSuccess: '#016201',
    danger: '#ca082a',
    bgDanger: '#9d041f',
  },
  layout: {
    sizes: {
      tiny: 320,
      small: 360,
      medium: 481,
      large: 800,
      huge: 1200,
    },
    contentWidth: 650,
  },
};

export type Theme = typeof theme;

export default theme;
