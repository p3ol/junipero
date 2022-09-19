import { action } from '@storybook/addon-actions';

import SliderField from './';

export default { title: 'junipero/SliderField' };

export const basic = () => (
  <SliderField onChange={action('change')} />
);
