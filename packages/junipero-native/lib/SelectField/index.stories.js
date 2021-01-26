import React from 'react';
import SelectField from './index';

export default { title: 'junipero-native/SelectField' };

const options = [
  { title: 'One' },
  { title: 'Two' },
  { title: 'Three' },
];

export const basic = () => (
  <React.Fragment>
    <SelectField options={options} theme='basic'/>
  </React.Fragment>
);
