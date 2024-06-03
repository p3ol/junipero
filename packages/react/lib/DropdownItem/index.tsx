import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { classNames } from '@junipero/core';

export declare interface DropdownItemProps
  extends ComponentPropsWithoutRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
}

const DropdownItem = ({
  className,
  ...rest
}: DropdownItemProps): JSX.Element => (
  <li className={classNames('dropdown-item', className)} {...rest} />
);

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
