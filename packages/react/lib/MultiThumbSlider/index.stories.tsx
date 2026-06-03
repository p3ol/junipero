import { action } from 'storybook/actions';

import { slideInDownMenu } from '../../../transitions/lib';
import MultiThumbSlider from '.';

export default { title: 'react/MultiThumbSlider' };

export const Basic = () => (
  <MultiThumbSlider
    values={[50]}
    names={['Original', 'Variant1']}
    onMove={action('move')}
  />
);

export const WithAllGivenNames = () => (
  <MultiThumbSlider
    values={[25, 25, 25]}
    names={['Original', 'Variant1', 'Variant2', 'Variant3']}
    onMove={action('move')}
  />
);

export const WithUnsetRemainder = () => (
  <MultiThumbSlider
    values={[25, 25]}
    names={['Original', 'Variant1']}
    onMove={action('move')}
  />
);

export const WithNamedRemainder = () => (
  <MultiThumbSlider
    values={[25, 25]}
    names={['Original', 'Variant1']}
    remainderName="Leftover"
    onMove={action('move')}
  />
);

export const WithCustomMaxValue = () => (
  <MultiThumbSlider
    values={[50]}
    names={['Original', 'Variant1']}
    customMaxValue={200}
    onMove={action('move')}
  />
);

export const WithoutTooltip = () => (
  <MultiThumbSlider
    values={[50]}
    names={['Original', 'Variant1']}
    onMove={action('move')}
    tooltipEnabled={false}
  />
);

export const AnimatedTooltip = () => (
  <MultiThumbSlider
    values={[50]}
    names={['Original', 'Variant1']}
    onMove={action('move')}
    animateTooltip={slideInDownMenu}
  />
);
