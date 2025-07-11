import { action } from 'storybook/actions';
import { slideInDownMenu } from '@junipero/transitions';

import Slider from '.';

export default { title: 'react/Slider' };

export const basic = () => (
  <Slider onMove={action('move')} />
);

export const withoutTooltip = () => (
  <Slider tooltipEnabled={false} />
);

export const animatedTooltip = () => (
  <Slider animateTooltip={slideInDownMenu} />
);
