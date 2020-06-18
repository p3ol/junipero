import React from 'react';
import { action } from '@storybook/addon-actions';

import TextField from './index';

export default { title: 'junipero/TextField' };

export const basic = () => (
  <TextField placeholder="First name" onChange={action('change')} />
);

export const withLabel = () => (
  <TextField
    placeholder="Type your first name"
    label="First name"
    onChange={action('change')}
  />
);

export const withForcedLabel = () => (
  <TextField
    placeholder="Type your first name"
    label="First name"
    forceLabel={true}
    onChange={action('change')}
  />
);

export const autoFocused = () => (
  <TextField autoFocus onChange={action('change')} />
);

export const withValue = () => (
  <TextField value="test" onChange={action('change')} />
);

export const disabled = () => (
  <TextField disabled value="test" />
);

export const withValidation = () => (
  <TextField label="Age" placeholder="Age" validate={val => /^[0-9]+$/g.test(val)} />
);
