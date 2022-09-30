import { action } from '@storybook/addon-actions';

import Label from '../Label';
import Abstract from '../Abstract';
import TextField from './index';
import FieldControl from '../FieldControl';

export default { title: 'react/TextField' };

export const basic = () => (
  <TextField placeholder="First name" onChange={action('change')} />
);

export const basicMultiline = () => (
  <TextField
    rows={10}
    label="First name"
    placeholder="First name"
    onChange={action('change')}
  />
);

export const withLabelAndAbstract = () => (
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

export const autoFocused = () => (
  <TextField autoFocus onChange={action('change')} />
);

export const disabled = () => (
  <TextField disabled value="test" />
);

export const withValidation = () => (
  <TextField
    label="Age"
    placeholder="Age"
    onValidate={val => /^[0-9]+$/g.test(val)}
  />
);
