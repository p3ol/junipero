import { action } from '@storybook/addon-actions';

import CheckboxField from '.';

export default { title: 'react/Checkbox' };

export const basic = () => (
  <CheckboxField onChange={action('change')}>
    Check this
  </CheckboxField>
);

export const disabled = () => (
  <CheckboxField disabled={true}>
    Can&apos;t check this
  </CheckboxField>
);

export const alreadyChecked = () => (
  <CheckboxField onChange={action('change')} checked={true}>
    Uncheck this
  </CheckboxField>
);
export const alreadyCheckedAndDisabled = () => (
  <CheckboxField onChange={action('change')} checked={true} disabled={true}>
    Can&apos;t uncheck this
  </CheckboxField>
);

export const withValue = () => (
  <CheckboxField value="agreement" onChange={action('change')}>
    Check this
  </CheckboxField>
);

export const withAllEvents = () => (
  <CheckboxField
    value="agreement"
    onChange={action('change')}
    onFocus={action('focus')}
    onBlur={action('blur')}
  >
    Check this
  </CheckboxField>
);

export const withChildrenInProps = () => (
  <CheckboxField
    value="agreement"
    children={<p>this is given child</p>}
  />
);

export const withRequiredField = () => (
  <CheckboxField
    value="agreement"
    required={true}
    children={<p>this is given child</p>}
  />
);
