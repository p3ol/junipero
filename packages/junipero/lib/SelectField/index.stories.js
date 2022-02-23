import { action } from '@storybook/addon-actions';
import { CSSTransition } from 'react-transition-group';

import SelectField from './index';

export default { title: 'junipero/SelectField' };

const options = ['One', 'Two', 'Three'];

const search = ['Four', 'Five', 'Six'];

const objectOptions = [
  { title: 'One', value: 1 },
  { title: 'Two', value: 2 },
  { title: 'Three', value: 3 },
];

const optionsWithGroups = [
  {
    title: 'First group',
    options: [
      { title: 'One', value: 1 },
      { title: 'Two', value: 2 },
      { title: 'Three', value: 3 },
    ],
  },
  {
    title: 'Second group',
    options: [
      { title: 'Four', value: 4 },
      { title: 'Five', value: 5 },
      { title: 'Six', value: 6 },
    ],
  },
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
    label="Chosen item"
    onChange={action('change')}
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
    options={objectOptions}
    placeholder="Choose one item"
    parseTitle={o => o.title}
    onChange={action('change')}
  />
);

export const withObjectOptionsAndValueEnforced = () => (
  <SelectField
    options={objectOptions}
    placeholder="Choose one item"
    parseTitle={o => o.title}
    parseValue={o => o.value}
    onChange={action('change')}
  />
);

export const withPlaceholder = () => (
  <SelectField
    options={options}
    placeholder="Select an item"
    label="Chosen item"
    onChange={action('change')}
  />
);

export const autoFocused = () => (
  <SelectField
    options={options}
    autoFocus
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

export const withGroups = () => (
  <SelectField
    options={optionsWithGroups}
    parseTitle={o => o.title}
    onChange={action('change')}
  />
);

export const withGroupsAndSearch = () => (
  <SelectField
    options={optionsWithGroups}
    parseTitle={o => o.title}
    search={val => search.filter(o => (new RegExp(val, 'ig')).test(o))}
    onChange={action('change')}
  />
);

export const animated = () => (
  <SelectField
    options={options}
    animateMenu={(menu, { opened }) => (
      <CSSTransition
        in={opened}
        mountOnEnter={true}
        unmountOnExit={true}
        timeout={300}
        classNames="slide-in-up-dropdown"
        children={menu}
      />
    )}
    onChange={action('change')}
  />
);

export const alwaysOpened = () => (
  <SelectField
    trigger="manual"
    opened={true}
    options={options}
    placeholder="Choose one item"
    onChange={action('change')}
  />
);
