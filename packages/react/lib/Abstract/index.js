import { classNames } from '@junipero/core';

import { useFieldControl } from '../hooks';

const Abstract = ({ className, ...rest }) => {
  const { valid = true, dirty = false, focused = false } = useFieldControl();

  return (
    <div
      { ...rest }
      className={classNames(
        'junipero abstract',
        { invalid: !valid && !focused && dirty },
        className
      )}
    />
  );
};

Abstract.displayName = 'Abstract';

export default Abstract;
