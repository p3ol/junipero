import { action } from '@storybook/addon-actions';

import Tabs from './';
import Tab from '../Tab';

export default { title: 'react/Tabs' };

export const basic = () => (
  <Tabs onToggle={action('change')}>
    <Tab title="Title One">Content One</Tab>
    <Tab title="Title Two">Content Two</Tab>
  </Tabs>
);

export const withTabsProp = () => (
  <Tabs
    tabs={[
      { title: 'Title One', content: 'Content One' },
      { title: 'Title Two', content: 'Content Two' },
    ]}
    onToggle={action('change')}
  />
);
