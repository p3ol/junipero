import { action } from 'storybook/actions';

import Label from '../Label';
import Abstract from '../Abstract';
import FieldControl from '../FieldControl';
import CodeField from './index';

export default { title: 'react/CodeField' };

export const basic = () => (
  <CodeField onChange={action('change')} />
);

export const autoFocused = () => (
  <CodeField autoFocus onChange={action('change')} />
);

export const withValue = () => (
  <CodeField value="253453" onChange={action('change')} />
);

export const disabled = () => (
  <CodeField disabled value="253453" />
);

export const withValidation = () => (
  <CodeField onValidate={val => /^[0-9]+$/g.test(val)} />
);

export const withLabelAndAbstract = () => (
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
