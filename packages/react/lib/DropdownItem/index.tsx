import {
  type ComponentPropsWithoutRef,
  ReactElement,
  cloneElement,
} from 'react';
import { classNames } from '@junipero/core';

import { useAccessibility } from '../hooks';

export declare interface DropdownItemProps
  extends ComponentPropsWithoutRef<'li'> {
  accessibilityKey?: string;
  }

const DropdownItem = ({
  accessibilityKey,
  className,
  children,
  ...rest
}: DropdownItemProps) => {
  const { registerElement, setCurrentlyFocusedElement } = useAccessibility();

  const child: ReactElement<
    ComponentPropsWithoutRef<any>
  > = typeof children !== 'string' && Array.isArray(children)
    ? children[0] : children;

  registerElement(accessibilityKey);

  return (
    <li
      id={accessibilityKey}
      key={accessibilityKey}
      className={classNames('dropdown-item', className)}
      role="option"
      tabIndex={0}
      onMouseEnter={() => setCurrentlyFocusedElement(accessibilityKey)}
      { ...rest }
    >
      { cloneElement(child, {
        tabIndex: -1,
      }) }
    </li>
  );
};

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
