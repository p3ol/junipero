import { classNames } from '@junipero/core';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

import { useFieldControl } from '../hooks';

declare interface AbstractProps extends ComponentPropsWithoutRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
}

const Abstract = (
  {
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
