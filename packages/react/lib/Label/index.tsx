import { classNames } from '@junipero/core';
import { ComponentPropsWithoutRef } from 'react';

import { useFieldControl } from '../hooks';

export declare interface LabelProps extends ComponentPropsWithoutRef<any> {
  className?: string;
}

const Label = ({ className, ...rest }: LabelProps) => {
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
