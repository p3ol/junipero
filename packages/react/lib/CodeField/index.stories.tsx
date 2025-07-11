import { action } from 'storybook/actions';

import Label from '../Label';
import Abstract from '../Abstract';
import FieldControl from '../FieldControl';
import CodeField from './index';

export default { title: 'react/CodeField' };

export const Basic = () => (
  <CodeField onChange={action('change')} />
);

export const AutoFocused = () => (
  <CodeField autoFocus onChange={action('change')} />
);

export const WithValue = () => (
  <CodeField value="253453" onChange={action('change')} />
);

export const Disabled = () => (
  <CodeField disabled value="253453" />
);

export const WithValidation = () => (
  <CodeField onValidate={val => /^[0-9]+$/g.test(val)} />
);

export const WithLabelAndAbstract = () => (
  <FieldControl>
    <Label className="info" htmlFor="code">One-time code</Label>
    <CodeField
      id="code"
      name="code"
      onChange={action('change')}
      required
    />
    <Abstract className="info">
      Here is a little help writing your name
    </Abstract>
  </FieldControl>
);
