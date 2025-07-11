import { useState } from 'react';
import { action } from 'storybook/actions';

import Toggle from '.';

export default { title: 'react/Toggle' };
export const Basic = () => (
  <Toggle>Check that</Toggle>
);

export const AlreadyChecked = () => (
  <Toggle checked={true}>Uncheck this</Toggle>
);

export const WithOnChange = () => (
  <Toggle
    onChange={action('change')}
    value="agreement"
  >
    Check this
  </Toggle>
);

export const Disabled = () => (
  <Toggle disabled={true}>cannot check this</Toggle>
);

export const DisabledChecked = () => (
  <Toggle disabled={true} checked={true}>cannot uncheck this</Toggle>
);

export const WithValueChanging = () => {
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
