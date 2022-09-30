import FieldControl from '../FieldControl';
import Label from '../Label';
import Abstract from '../Abstract';
import SelectField from './index';

export default { title: 'react/SelectField' };

export const basic = () => (
  <SelectField
    placeholder="Type a name"
    options={['Item 1', 'Item 2', 'Item 3']}
  />
);

export const autoFocused = () => (
  <SelectField
    autoFocus
    placeholder="Type a name"
    options={['Item 1', 'Item 2', 'Item 3']}
  />
);

export const multiple = () => (
  <SelectField
    placeholder="Type a name"
    multiple={true}
    value={['Item 1', 'Item 2', 'Item 4']}
    options={[{ title: 'Group 1', options: ['Item 1', 'Item 2'] }, 'Item 3']}
  />
);

export const disabled = () => (
  <SelectField
    placeholder="Type a name"
    multiple={true}
    value={['Item 1', 'Item 2']}
    disabled={true}
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

export const withLabelAndAbstract = () => (
  <FieldControl>
    <Label className="info" htmlFor="itemname">Item name</Label>
    <SelectField
      placeholder="Type a name"
      options={['Item 1', 'Item 2', 'Item 3']}
      onValidate={v => v === 'Item 1'}
    />
    <Abstract className="info">
      Here is a little help selecting a name
    </Abstract>
  </FieldControl>
);

export const multipleWithLabelAndAbstract = () => (
  <FieldControl>
    <Label className="info" htmlFor="itemname">Item name</Label>
    <SelectField
      placeholder="Type a name"
      options={['Item 1', 'Item 2', 'Item 3']}
      onValidate={v => v.includes('Item 1')}
      multiple={true}
    />
    <Abstract className="info">
      Here is a little help selecting a name
    </Abstract>
  </FieldControl>
);

export const withArbitraryValues = () => (
  <SelectField
    placeholder="Type a name"
    options={['Item 1', 'Item 2', 'Item 3']}
    allowArbitraryItems={true}
    multiple={true}
  />
);
