import React from 'react';
import SelectField from './index';

export default { title: 'junipero-native/SelectField' };

const options = [
  { title: 'option1' },
  { title: 'option2' },
  { title: 'option3' },
];

export const basic = () => (
  <React.Fragment>
    <p><SelectField options={options} theme='basic'/></p>
  </React.Fragment>
);
