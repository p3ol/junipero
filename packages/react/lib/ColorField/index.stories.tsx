import { action } from 'storybook/actions';
import { slideInDownMenu } from '@junipero/transitions';

import FieldControl from '../FieldControl';
import Label from '../Label';
import Abstract from '../Abstract';
import ColorField from '.';

export default { title: 'react/ColorField' };

export const Basic = () => (
  <ColorField placeholder="Pick a color" onChange={action('change')} />
);

export const WithLabelAndAbstract = () => (
  <FieldControl>
    <Label className="info" htmlFor="firstname">Eye color</Label>
    <ColorField
      id="firstname"
      placeholder="Pick a color"
      onChange={action('change')}
      onValidate={() => false}
    />
    <Abstract className="info">
      Take a closer look at your eyes in a mirror
    </Abstract>
  </FieldControl>
);

export const AutoFocused = () => (
  <ColorField
    autoFocus={true}
    onChange={action('change')}
  />
);

export const AlwaysOpened = () => (
  <ColorField opened={true} trigger="manual" onChange={action('change')} />
);

export const Animated = () => (
  <ColorField animateMenu={slideInDownMenu} />
);
