import React from 'react';
import { action } from '@storybook/addon-actions';

import DateTimeField from './index';

export default { title: 'DateTimeField' };

export const basic = () => (
  <DateTimeField placeholder="Date of birth" onChange={action('change')} />
);

export const autoFocused = () => (
  <DateTimeField autoFocus onChange={action('change')} />
);

export const withValue = () => (
  <DateTimeField value={new Date()} onChange={action('change')} />
);

export const disabled = () => (
  <DateTimeField disabled value={new Date()} />
);

export const withValidation = () => (
  <DateTimeField validate={val => val?.getFullYear() === 2020} />
);
