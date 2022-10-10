import { action } from '@storybook/addon-actions';

import RadioField from '.';

export default { title: 'react/RadioField' };
const basicOptions = [
  { title: 'Apple', value: 'Apple' },
  { title: 'Pear', value: 'Pear' },
  { title: 'Orange', value: 'Orange' },
];

const basicOptionsOneDisabled = [
  { title: 'Apple', value: 'Apple' },
  { title: 'Pear', value: 'Pear' },
  { title: 'Orange', value: 'Orange', disabled: true },
];

const withDescriptions = [
  { title: 'Apple', value: 'Apple', description: 'This is a description' },
  { title: 'Pear', value: 'Pear', description: 'This is a description' },
  { title: 'Orange', value: 'Orange', description: 'This is a description' },
];
export const basic = () => (
  <RadioField options={basicOptions} onChange={action('change')} />
);
