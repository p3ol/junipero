import { action } from '@storybook/addon-actions';
import { slideInDownMenu } from '@junipero/transitions';

import FieldControl from '../FieldControl';
import Label from '../Label';
import Abstract from '../Abstract';
import ColorField from '.';

export default { title: 'react/ColorField' };

export const basic = () => (
  <ColorField placeholder="Pick a color" onChange={action('change')} />
);

export const withLabelAndAbstract = () => (
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

export const autoFocused = () => (
  <ColorField
    autoFocus={true}
    onChange={action('change')}
  />
);

export const alwaysOpened = () => (
  <ColorField autoFocus={true} trigger="manual" onChange={action('change')} />
);

export const animated = () => (
  <ColorField animateMenu={slideInDownMenu} />
);
