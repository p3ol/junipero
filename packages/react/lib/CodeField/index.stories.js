import { action } from '@storybook/addon-actions';

import CodeField from './index';

export default { title: 'react/CodeField' };

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
  <CodeField onValidate={val => /^[0-9]+$/g.test(val)} />
);
