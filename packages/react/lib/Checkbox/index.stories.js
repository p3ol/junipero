import { action } from '@storybook/addon-actions';

import Checkbox from '.';

export default { title: 'react/Checkbox' };

export const basic = () => (
  <Checkbox onChange={action('change')}>
    Check this
  </Checkbox>
);

export const disabled = () => (
  <Checkbox disabled={true}>
    Can&apos;t check this
  </Checkbox>
);

export const alreadyChecked = () => (
  <Checkbox onChange={action('change')} checked={true}>
    Uncheck this
  </Checkbox>
);
export const alreadyCheckedAndDisabled = () => (
  <Checkbox onChange={action('change')} checked={true} disabled={true}>
    Can&apos;t uncheck this
  </Checkbox>
);

export const withValue = () => (
  <Checkbox value="agreement" onChange={action('change')}>
    Check this
  </Checkbox>
);

export const withAllEvents = () => (
  <Checkbox
    value="agreement"
    onChange={action('change')}
    onFocus={action('focus')}
    onBlur={action('blur')}
  >
    Check this
  </Checkbox>
);

export const withChildrenInProps = () => (
  <Checkbox
    value="agreement"
    children={<p>this is given child</p>}
  />
);
