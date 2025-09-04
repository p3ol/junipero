'use client';

import { useEffect, type ComponentPropsWithoutRef } from 'react';
import { classNames } from '@junipero/core';

import { useAccessibility } from '../hooks';

export declare interface DropdownItemProps
  extends ComponentPropsWithoutRef<'li'> {
  a11yKey?: string | number;
}

const DropdownItem = ({
  a11yKey,
  className,
  children,
  ...rest
}: DropdownItemProps) => {
  const { registerElement, setCurrentlyFocusedElement } = useAccessibility();

  useEffect(() => {
    registerElement(a11yKey?.toString());
  }, [a11yKey, registerElement]);

  return (
    <li
      id={a11yKey as string}
      key={a11yKey}
      className={classNames('dropdown-item', className)}
      role="option"
      onMouseEnter={() => setCurrentlyFocusedElement(a11yKey)}
      { ...rest }
    >
      { children }
    </li>
  );
};

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
