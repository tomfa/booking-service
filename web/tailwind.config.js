module.exports = {
  mode: 'jit',
  important: true,
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  // Active dark mode on class basis
  darkMode: 'class',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
    './kit/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      color: {
        'sloth-light': '#FCE3B1',
        'sloth-medium': '#BDAA84',
        'sloth-dark': '#B4663A',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
      borderColor: ['checked'],
      inset: ['checked'],
      zIndex: ['hover', 'active'],
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('@tailwindcss/forms'),
  ],
  future: {
    purgeLayersByDefault: true,
  },
};
