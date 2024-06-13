import type { ComponentPropsWithoutRef } from 'react';
import { classNames } from '@junipero/core';

import { useFieldControl } from '../hooks';

export declare interface AbstractProps
  extends ComponentPropsWithoutRef<'div'> {}

const Abstract = ({
  className,
  ...rest
}: AbstractProps) => {
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
