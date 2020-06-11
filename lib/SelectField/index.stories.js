import React from 'react';
import { action } from '@storybook/addon-actions';

import SelectField from './index';

export default { title: 'SelectField' };

const options = ['One', 'Two', 'Three'];

const objectOptions = [
  { title: 'One', value: 1 },
  { title: 'Two', value: 2 },
  { title: 'Three', value: 3 },
];

export const basic = () => (
  <SelectField
    options={options}
    placeholder="Choose one item"
    onChange={action('change')}
  />
);

export const withObjectOptions = () => (
  <SelectField
    options={objectOptions}
    placeholder="Choose one item"
    parseTitle={o => o.title}
    onChange={action('change')}
  />
);

export const withObjectOptionsAndValueEnforced = () => (
  <SelectField
    options={objectOptions}
    placeholder="Choose one item"
    parseTitle={o => o.title}
    parseValue={o => o.value}
    onChange={action('change')}
  />
);

export const withPlaceholder = () => (
  <SelectField
    placeholder="Select an item"
    label="Chosen item"
    onChange={action('change')}
  />
);

export const autoFocused = () => (
  <SelectField autoFocus onChange={action('change')} />
);
