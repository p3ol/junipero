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
  <SelectField
    options={options}
    placeholder="Choose one item"
    onChange={action('change')}
  />
);

export const withLabel = () => (
  <SelectField
    options={options}
    placeholder="Choose one item"
    onChange={action('change')}
    label="Chosen item"
  />
);

export const noOptions = () => (
  <SelectField
    placeholder="Choose one item"
    onChange={action('change')}
  />
);

export const withObjectOptions = () => (
  <SelectField
    placeholder="Choose one item"
    onChange={action('change')}
    options={objectOptions}
    parseTitle={o => o.title}
  />
);

export const withObjectOptionsAndValueEnforced = () => (
  <SelectField
    placeholder="Choose one item"
    onChange={action('change')}
    options={objectOptionsWithValues}
    parseTitle={o => o.title}
    parseValue={o => o.value}
  />
);

export const withPlaceholder = () => (
  <SelectField
    options={options}
    placeholder="Select an item"
    onChange={action('change')}
  />
);

export const autoFocused = () => (
  <SelectField
    options={options}
    autoFocus
    placeholder="Choose one item"
    onChange={action('change')}
  />
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
    parseTitle={(o, isFieldValue) => o && isFieldValue
      ? `Custom title: ${o}`
      : o
    }
    onChange={action('change')}
  />
);
