import React from 'react';
import { action } from '@storybook/addon-actions';

import Tabs from './';
import Tab from '../Tab';

export default { title: 'junipero/Tabs' };

export const basic = () => (
  <Tabs onChange={action('change')}>
    <Tab title="Title One">Content One</Tab>
    <Tab title="Title Two">Content Two</Tab>
  </Tabs>
);
