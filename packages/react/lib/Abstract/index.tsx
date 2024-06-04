import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { classNames } from '@junipero/core';

import { useFieldControl } from '../hooks';

export declare interface AbstractProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
}

const Abstract = ({
  className,
  ...rest
}: AbstractProps): JSX.Element => {
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
