const plugin = require('tailwindcss/plugin');

module.exports = plugin(() => {}, {
  theme: {
    colors: {
      // Primary
      velvet: {
        DEFAULT: '#5C56DF',
        hover: '#807BFC',
        active: '#4D47CB',
        disabled: '#D6D4F7',
        background: '#F6F6FD',
      },
      lime: {
        DEFAULT: '#7ED496',
        hover: '#A7E0B7',
        active: '#60B678',
        disabled: '#EAF8EE',
        background: '#F2F9F4',
      },
      grapefruit: {
        DEFAULT: '#EE7674',
        hover: '#F28B89',
        active: '#D36664',
        disabled: '#FCE9E9',
        background: '#FAEEEE',
      },
      sunglow: {
        DEFAULT: '#FFB800',
        hover: '#FFD66D',
        active: '#EA9A00',
        disabled: '#FFF4D6',
        background: '#FFFAED',
      },

      // Text
      onyx: '#1A1A1A',
      tundora: '#424242',

      // Neutral
      seashell: '#FEFEFE',
      alabaster: '#FCFCFC',
      concrete: '#F3F3F3',
      mischka: '#DFE1E6',
      slate: '#6B778C',

      // Dark mode
      'dark-velvet-disabled': '#424078',
      'dark-velvet-background': '#2A284B',
      'dark-velvet-foreground': '#3C3886',

      'dark-lime-disabled': '#51725A',
      'dark-lime-background': '#47604E',
      'dark-lime-foreground': '#51845F',

      'dark-grapefruit-disabled': '#8D5454',
      'dark-grapefruit-background': '#5E4343',
      'dark-grapefruit-foreground': '#A45C5C',

      'dark-sunglow-disabled': '#756333',
      'dark-sunglow-background': '#4D4634',
      'dark-sunglow-foreground': '#B2974B',

      nevada: '#646873',
      gondola: '#1E1E1E',
    },
  },
});
