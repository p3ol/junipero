import { action } from 'storybook/actions';
import { slideInDownMenu } from '@junipero/transitions';

import Slider from '.';

export default { title: 'react/Slider' };

export const Basic = () => (
  <Slider onMove={action('move')} />
);

export const WithoutTooltip = () => (
  <Slider tooltipEnabled={false} />
);

export const AnimatedTooltip = () => (
  <Slider animateTooltip={slideInDownMenu} />
);
