import type { ComponentPropsWithoutRef } from 'react';
import { classNames } from '@junipero/core';

export declare interface SpinnerProps extends ComponentPropsWithoutRef<'div'> {}

const Spinner = ({ className, ...rest }: SpinnerProps) => (
  <div className={classNames('junipero spinner', className)} { ...rest } />
);

Spinner.displayName = 'Spinner';

export default Spinner;
