import { withThemeByClassName } from "@storybook/addon-styling";

import './index.sass';

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    parentSelector: 'html',
  }),
];
