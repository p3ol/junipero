import type { ComponentPropsWithoutRef } from 'react';
import { classNames } from '@junipero/core';

export declare interface DropdownItemProps
  extends ComponentPropsWithoutRef<'li'> {}

const DropdownItem = ({
  className,
  ...rest
}: DropdownItemProps) => (
  <li className={classNames('dropdown-item', className)} { ...rest } />
);

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
