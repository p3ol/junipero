import { action } from '@storybook/addon-actions';

import TagsField from './index';

export default { title: 'junipero/TagsField' };

const options = [
  { title: 'One', value: 'one' },
  { title: 'Two', value: 'two' },
  { title: 'Three', value: 'three' },
];

const search = [
  { title: 'Four', value: 'four' },
  { title: 'Five', value: 'five' },
  { title: 'Six', value: 'six' },
];

export const basic = () => (
  <TagsField placeholder="Type a name..." onChange={action('change')} />
);

export const withLabel = () => (
  <TagsField
    placeholder="Type a name..."
    label="First names"
    onChange={action('change')}
  />
);

export const withForcedLabel = () => (
  <TagsField
    placeholder="Type a name..."
    label="First names"
    forceLabel={true}
    onChange={action('change')}
  />
);

export const autoFocused = () => (
  <TagsField autoFocus onChange={action('change')} />
);

export const withValue = () => (
  <TagsField value={['test']} onChange={action('change')} />
);

export const disabled = () => (
  <TagsField disabled value={['test']} />
);

export const withSearch = () => (
  <TagsField
    search={val => search.filter(o => (new RegExp(val, 'ig')).test(o.title))}
    placeholder="Type a name..."
    label="First names"
    onChange={action('change')}
    parseTitle={o => o?.title || o}
  />
);

export const withSearchAndOptions = () => (
  <TagsField
    search={val => search.filter(o => (new RegExp(val, 'ig')).test(o.title))}
    placeholder="Type a name..."
    label="First names"
    onChange={action('change')}
    parseTitle={o => o?.title || o}
    options={options}
  />
);

export const withoutAutoAdd = () => (
  <TagsField
    search={val => search.filter(o => (new RegExp(val, 'ig')).test(o.title))}
    placeholder="Type a name..."
    label="First names"
    onChange={action('change')}
    parseTitle={o => o?.title || o}
    options={options}
    autoAddOnBlur={false}
  />
);

export const withOneOccurenceMax = () => (
  <TagsField
    search={val => search.filter(o => (new RegExp(val, 'ig')).test(o.title))}
    placeholder="Type a name..."
    label="First names"
    onChange={action('change')}
    parseTitle={o => o?.title || o}
    onlyAllowSearchResults
    options={options}
  />
);

export const withValidation = () => (
  <TagsField
    validateTag={tag => parseInt(tag) > 1000}
    validateInput={val => val === '' || parseInt(val) > 0}
    onChange={action('change')}
  />
);
