import { action } from '@storybook/addon-actions';

import Tooltip from './index';

export default { title: 'react/Tooltip' };

export const basic = () => (
  <Tooltip text="Text" onToggle={action('toggle')}>
    Hover me
  </Tooltip>
);

export const click = () => (
  <Tooltip text="Text" onToggle={action('toggle')} trigger="click">
    Click me
  </Tooltip>
);
