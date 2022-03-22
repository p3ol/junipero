import { action } from '@storybook/addon-actions';

import ToggleField from './index';

export default { title: 'junipero/ToggleField' };

export const basic = () => (
  <ToggleField checkedLabel="Check this" onChange={action('change')} />
);

export const disabled = () => (
  <ToggleField checkedLabel="Disabled" disabled={true} />
);
