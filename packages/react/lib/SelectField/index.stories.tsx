import { useState } from 'react';
import { slideInDownMenu } from '@junipero/transitions';
import { action } from 'storybook/actions';

import type { FieldContent } from '../types';
import FieldControl from '../FieldControl';
import Label from '../Label';
import Abstract from '../Abstract';
import SelectField, { SelectFieldOptionObject, type SelectFieldProps } from './index';

export default { title: 'react/SelectField' };

export const basic = () => (
  <SelectField
    placeholder="Type a name"
    options={['Item 1', 'Item 2', 'Item 3']}
    onChange={action('onChange')}
  />
);

export const controlled = () => {
  const [value, setValue] = useState('Item 1');
  const props = {} as SelectFieldProps;

  return (
    <SelectField
      { ...props }
      value={value}
      placeholder="Type a name"
      parseTitle={o => (o as SelectFieldOptionObject)?.title || o as string}
      parseValue={o => (o as SelectFieldOptionObject)?.value || o}
      onChange={(field: FieldContent<string>) => setValue(field.value)}
    />
  );
};

export const notSearchable = () => (
  <SelectField
    searchable={false}
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

export const multipleWithGroups = () => (
  <SelectField
    placeholder="Type a name"
    multiple={true}
    value={['access.metrics']}
    parseTitle={o => (o as SelectFieldOptionObject)?.title ?? o as string}
    parseValue={o => (o as SelectFieldOptionObject)?.value ?? o}
    options={[
      { title: 'Susbcribe', options: [
        {
          title: 'Susbcribe metrics',
          value: 'subscribe.metrics',
        },
      ] },
      { title: 'Access', options: [
        { title: 'Access metrics', value: 'access.metrics' },
      ] },
      { title: 'Engage', options: [
        { title: 'Engage metrics', value: 'engage.metrics' },
      ] },
    ]}
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
      onValidate={(v: string) => v.includes('Item 1')}
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

export const withOnlyArbitraryValues = () => (
  <SelectField
    placeholder="Type a name"
    allowArbitraryItems={true}
    multiple={true}
    noOptionsEnabled={false}
  />
);

export const withClickOptionsAndKeyboardHandler = () => (
  <SelectField
    toggleClick={true}
    keyboardHandler={true}
    placeholder="Type a name"
    options={['Item 1', 'Item 2', 'Item 3']}
    onChange={action('onChange')}
  />
);

export const animated = () => (
  <SelectField animateMenu={slideInDownMenu} />
);

export const noEmpty = () => (
  <SelectField
    placeholder="Type a name"
    noOptionsEnabled={false}
    animateMenu={slideInDownMenu}
  />
);

export const onAForm = () => {
  const actions = action('submitted');

  return (
    <form
      onSubmit={e => {
        actions({ name: 'submitted', event: e });
        e.preventDefault();
      }}
    >
      <SelectField
        allowArbitraryItems={true}
        multiple={true}
        noOptionsEnabled={false}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export const withPagination = () => {
  const [options, setOptions] = useState(
    Array.from({ length: 10 }).map((_, i) => `Item ${i + 1}`)
  );
  const [hasMore, setHasMore] = useState(true);

  const onLoadMore = async (page: number) => {
    action('onLoadMore')(page);

    if (page <= 3) {
      await new Promise(resolve => setTimeout(resolve, 3000));

      setOptions(o => o.concat(
        Array.from({ length: 10 }).map((_, i) => `Item ${i + o.length + 1}`)
      ));
    } else {
      setHasMore(false);
    }
  };

  return (
    <SelectField
      placeholder="Type a name"
      options={options}
      onChange={action('onChange')}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
    />
  );
};
