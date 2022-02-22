import React from 'react';
import { action } from '@storybook/addon-actions';

import SelectField from './index';

export default { title: 'junipero-native/SelectField' };

const options = ['One', 'Two', 'Three'];

const search = ['Four', 'Five', 'Six'];

const objectOptions = [
  { title: 'One' },
  { title: 'Two' },
  { title: 'Three' },
];

const objectOptionsWithValues = [
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
      options={objectOptionsWithValues}
      parseTitle={o => o.title}
      parseValue={o => o.value}
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

export const withSearch = () => (
  <SelectField
    options={options}
    search={val => search.filter(o => (new RegExp(val, 'ig')).test(o))}
    onChange={action('change')}
  />
);

export const withParsedFieldTitle = () => (
  <SelectField
    options={options}
    placeholder="Choose one item"
    dissociateFieldParsing={true}
    parseFieldTitle={o => o && `Custom title: ${o}`}
    onChange={action('change')}
  />
);
