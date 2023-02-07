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
    },
  },
});
