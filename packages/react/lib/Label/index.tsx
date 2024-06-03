import type { ComponentPropsWithoutRef } from 'react';
import { classNames } from '@junipero/core';

import { useFieldControl } from '../hooks';

export declare interface LabelProps extends ComponentPropsWithoutRef<any> {
  className?: string;
}

const Label = ({ className, ...rest }: LabelProps): JSX.Element => {
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
