import { action } from '@storybook/addon-actions';

import CodeField from './index';

export default { title: 'junipero/CodeField' };

export const basic = () => (
  <CodeField onChange={action('change')} />
);

export const autoFocused = () => (
  <CodeField autoFocus onChange={action('change')} />
);

export const withValue = () => (
  <CodeField value="253453" onChange={action('change')} />
);

export const disabled = () => (
  <CodeField disabled value="253453" />
);

export const withValidation = () => (
  <CodeField validate={val => /^[0-9]+$/g.test(val)} />
);
