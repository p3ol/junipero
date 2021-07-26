import React from 'react';
import { action } from '@storybook/addon-actions';

import CheckboxField from './index';

export default { title: 'junipero/CheckboxField' };

export const basic = () => (
  <CheckboxField onChange={action('change')}>Check this</CheckboxField>
);
