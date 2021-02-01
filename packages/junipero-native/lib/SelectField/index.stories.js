import React from 'react';
import { action } from '@storybook/addon-actions';
import SelectField from './index';

export default { title: 'junipero-native/SelectField' };


const options = ['One', 'Two', 'Three'];

const objectOptions = [
  { title: 'One', value: 1 },
  { title: 'Two', value: 2 },
  { title: 'Three', value: 3 },
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
      onChange={action('change')}
      label="Chosen item"
    />
  </React.Fragment>
);

export const noOptions = () => (
  <React.Fragment>
    <SelectField
      placeholder="Choose one item"
      onChange={action('change')}
    />
  </React.Fragment>
);

export const withObjectOptions = () => (
  <React.Fragment>
    <SelectField
      placeholder="Choose one item"
      onChange={action('change')}
      options={objectOptions}
      parseTitle={o => o.title}
    />
  </React.Fragment>
);

export const withObjectOptionsAndValueEnforced = () => (
  <React.Fragment>
    <SelectField
      placeholder="Choose one item"
      onChange={action('change')}
    />
  </React.Fragment>
);

export const withPlaceholder = () => (
  <React.Fragment>
    <SelectField
      options={options}
      placeholder="Select an item"
      onChange={action('change')}
    />
  </React.Fragment>
);

export const autoFocused = () => (
  <React.Fragment>
    <SelectField
      options={options}
      autoFocus
      placeholder="Choose one item"
      onChange={action('change')}
    />
  </React.Fragment>
);
