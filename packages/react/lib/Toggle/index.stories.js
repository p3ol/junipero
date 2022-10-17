import { action } from '@storybook/addon-actions';
import { useState } from 'react';

import ToggleField from '.';

export default { title: 'react/ToggleField' };
export const basic = () => (
  <ToggleField>Check that</ToggleField>
);

export const alreadyChecked = () => (
  <ToggleField checked={true}>Uncheck this</ToggleField>
);

export const withOnChange = () => (
  <ToggleField
    onChange={action('change')}
    value="agreement"
  >
    Check this
  </ToggleField>
);

export const disabled = () => (
  <ToggleField disabled={true}>cannot check this</ToggleField>
);

export const disabledChecked = () => (
  <ToggleField disabled={true} checked={true}>cannot uncheck this</ToggleField>
);

export const withValueChanging = () => {
  const [value, setValue] = useState(false);

  const changeValue = () => {
    setValue(!value);
  };

  return (
    <>
      <button onClick={changeValue}>change value</button>
      <ToggleField
        className="boxed"
        checked={value}
        onChange={e => setValue(e.value)}
      >
        Display more
      </ToggleField>
    </>
  );
};
