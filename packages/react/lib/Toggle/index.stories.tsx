import { useState } from 'react';
import { action } from '@storybook/addon-actions';

import Toggle from '.';

export default { title: 'react/Toggle' };
export const basic = () => (
  <Toggle>Check that</Toggle>
);

export const alreadyChecked = () => (
  <Toggle checked={true}>Uncheck this</Toggle>
);

export const withOnChange = () => (
  <Toggle
    onChange={action('change')}
    value="agreement"
  >
    Check this
  </Toggle>
);

export const disabled = () => (
  <Toggle disabled={true}>cannot check this</Toggle>
);

export const disabledChecked = () => (
  <Toggle disabled={true} checked={true}>cannot uncheck this</Toggle>
);

export const withValueChanging = () => {
  const [value, setValue] = useState(false);

  const changeValue = () => {
    setValue(!value);
  };

  return (
    <>
      <button onClick={changeValue}>change value</button>
      <Toggle
        className="boxed"
        checked={value}
        onChange={e => setValue(e.value)}
      >
        Display more
      </Toggle>
    </>
  );
};
