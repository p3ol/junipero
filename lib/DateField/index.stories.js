import React from 'react';
import { action } from '@storybook/addon-actions';

import DateField from './index';

export default { title: 'DateField' };

export const basic = () => (
  <DateField placeholder="Date of birth" onChange={action('change')} />
);

export const withPlaceholder = () => (
  <DateField
    placeholder="Select a date"
    label="Chosen date"
    onChange={action('change')}
  />
);

export const autoFocused = () => (
  <DateField autoFocus onChange={action('change')} />
);

export const withValue = () => (
  <DateField value={new Date(2019, 0, 1)} onChange={action('change')} />
);

export const disabled = () => (
  <DateField disabled value={new Date()} />
);

export const withValidation = () => (
  <DateField
    validate={val => val?.getFullYear() === 2020}
    onChange={action('change')}
  />
);

export const withMinAndMax = () => (
  <DateField
    min={new Date(2020, 0, 1)}
    max={new Date(2020, 11, 31)}
    onChange={action('change')}
  />
);
