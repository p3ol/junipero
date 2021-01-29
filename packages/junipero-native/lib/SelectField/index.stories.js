import React from 'react';
import { action } from '@storybook/addon-actions';
import SelectField from './index';

export default { title: 'junipero-native/SelectField' };


const options = ['One', 'Two', 'Three'];

const objectOptions = [
  { title: 'One' },
  { title: 'Two' },
  { title: 'Three' },
];

export const basic = () => (
  <React.Fragment>
    <SelectField
      options={options}
      placeholder="Choose one item"
      onChange={action('change')}
    />
  </React.Fragment>
);

export const withLabel = () => (
  <React.Fragment>
    <SelectField
      options={options}
      placeholder="Choose one item"
      label="Chosen item"
    />
  </React.Fragment>
);

export const noOptions = () => (
  <React.Fragment>
    <SelectField
      placeholder="Choose one item"
    />
  </React.Fragment>
);

export const withPlaceholder = () => (
  <React.Fragment>
    <SelectField
      options={options}
      placeholder="Select an item"
    />
  </React.Fragment>
);
