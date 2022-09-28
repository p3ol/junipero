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
    options={[{ title: 'Group 1', options: ['Item 1', 'Item 2'] }, 'Item 3']}
  />
);

export const asyncSearch = () => (
  <SelectField
    placeholder="Type a name"
    options={['Item 1', 'Item 2', 'Item 3']}
    onSearch={async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

      return ['Item 4', 'Item 5', 'Item 6'];
    }}
  />
);
