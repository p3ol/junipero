import { classNames } from '@junipero/core';
import { ComponentPropsWithoutRef } from 'react';

export declare interface SpinnerProps extends ComponentPropsWithoutRef<any> {
  className?: string;
}

const Spinner = ({ className, ...rest }: SpinnerProps) => (
  <div className={classNames('junipero spinner', className)} {...rest} />
);

Spinner.displayName = 'Spinner';

export default Spinner;
