import { useState } from 'react';
import { action } from 'storybook/actions';

import CheckboxField from '.';
import Abstract from '../Abstract';
import FieldControl from '../FieldControl';
import Label from '../Label';

export default { title: 'react/Checkbox' };

export const Basic = () => (
  <CheckboxField onChange={action('change')}>
    Check this
  </CheckboxField>
);

export const Disabled = () => (
  <CheckboxField disabled={true}>
    Can&apos;t check this
  </CheckboxField>
);

export const AlreadyChecked = () => (
  <CheckboxField onChange={action('change')} checked={true}>
    Uncheck this
  </CheckboxField>
);
export const AlreadyCheckedAndDisabled = () => (
  <CheckboxField onChange={action('change')} checked={true} disabled={true}>
    Can&apos;t uncheck this
  </CheckboxField>
);

export const WithValue = () => (
  <CheckboxField value="agreement" onChange={action('change')}>
    Check this
  </CheckboxField>
);

export const WithAllEvents = () => (
  <CheckboxField
    value="agreement"
    onChange={action('change')}
    onFocus={action('focus')}
    onBlur={action('blur')}
  >
    Check this
  </CheckboxField>
);

export const WithChildrenInProps = () => (
  <CheckboxField
    value="agreement"
    // eslint-disable-next-line react/no-children-prop
    children={<p>this is given child</p>}
  />
);

export const WithRequiredField = () => (
  <CheckboxField
    value="agreement"
    required={true}
  >
    <p>this is given child</p>
  </CheckboxField>
);

export const WithLabelAndAbstract = () => (
  <FieldControl>
    <Label className="info">CGU</Label>
    <CheckboxField
      value="agreement"
      required={true}
    >
      I have read and accept the CGU
    </CheckboxField>
    <Abstract className="info">
      You can see our CGU here
    </Abstract>
  </FieldControl>
);

export const Controlled = () => {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <button onClick={() => setChecked(c => !c)}>Toggle</button>
      <CheckboxField
        checked={checked}
        onChange={field => {
          setChecked(field.checked);
          action('change')(field);
        }}
      >
        Check this
      </CheckboxField>
    </>
  );
};
