import SelectField from './index';

export default { title: 'react/SelectField' };

export const basic = () => (
  <SelectField
    options={['Item 1', 'Item 2', 'Item 3']}
  />
);
