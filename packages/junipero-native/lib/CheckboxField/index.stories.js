import React from 'react';
import { action } from '@storybook/addon-actions';

import CheckboxField from './';

export default { title: 'junipero-native/CheckboxField' };

export const basic = () => (
  <CheckboxField value="Test" onChange={action('change')}>
    Check this
  </CheckboxField>
);
