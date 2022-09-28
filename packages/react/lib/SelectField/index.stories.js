import SelectField from './index';

export default { title: 'react/SelectField' };

export const basic = () => (
  <SelectField
    placeholder="Type a name"
    options={['Item 1', 'Item 2', 'Item 3']}
  />
);

export const multiple = () => (
  <SelectField
    placeholder="Type a name"
    multiple={true}
    options={['Item 1', 'Item 2', 'Item 3']}
  />
);
