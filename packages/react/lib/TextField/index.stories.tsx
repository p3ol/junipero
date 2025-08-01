import { action } from 'storybook/actions';

import Label from '../Label';
import Abstract from '../Abstract';
import FieldControl from '../FieldControl';
import TextField from './index';

export default { title: 'react/TextField' };

export const Basic = () => (
  <TextField placeholder="First name" onChange={action('change')} />
);

export const BasicMultiline = () => (
  <TextField
    rows={10}
    label="First name"
    placeholder="First name"
    onChange={action('change')}
  />
);

export const WithLabelAndAbstract = () => (
  <FieldControl>
    <Label className="info" htmlFor="firstname">First name</Label>
    <TextField
      id="firstname"
      placeholder="Type your first name"
      onChange={action('change')}
      onValidate={() => false}
    />
    <Abstract className="info">
      Here is a little help writing your name
    </Abstract>
  </FieldControl>
);

export const AutoFocused = () => (
  <TextField autoFocus onChange={action('change')} />
);

export const Disabled = () => (
  <TextField disabled value="test" />
);

export const WithValidation = () => (
  <TextField
    label="Age"
    placeholder="Age"
    onValidate={(val: string) => /^[0-9]+$/g.test(val)}
  />
);

export const TypeNumber = () => (
  <TextField
    className="field noscroll"
    label="Age"
    placeholder="Age"
    type="number"
    min={1}
    value={14}
    // max={100}
    onChange={action('change')}
  />
);

export const WithOnWheelOverrided = () => (
  <TextField
    className="field noscroll"
    label="Age"
    placeholder="Age"
    type="number"
    onWheel={action('wheel')}
  />
);
