import { classNames } from '@junipero/core';

import { useFieldControl } from '../hooks';

const Label = ({ className, ...rest }) => {
  const { valid = true, dirty = false, focused = false } = useFieldControl();

  return (
    <label
      { ...rest }
      className={classNames(
        'junipero label',
        { invalid: !valid && !focused && dirty },
        className
      )}
    />
  );
};

Label.displayName = 'Label';

export default Label;
