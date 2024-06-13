import {
  type MutableRefObject,
  Children,
  forwardRef,
  cloneElement,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  ForwardedProps,
  JuniperoRef,
  SpecialComponentPropsWithoutRef,
} from '../types';
import type { DropdownRef } from '../Dropdown';
import { useDropdown } from '../hooks';

export declare interface DropdownToggleRef extends JuniperoRef {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
}

export declare interface DropdownToggleProps
  extends SpecialComponentPropsWithoutRef {}

const DropdownToggle = forwardRef<DropdownToggleRef, DropdownToggleProps>(({
  children,
}, ref) => {
  const innerRef = useRef<any>();
  const { opened, refs, getReferenceProps } = useDropdown();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const child = Children.only(children);

  return cloneElement(child as JSX.Element, {
    className: classNames((child as JSX.Element)
      .props?.className, 'dropdown-toggle', { opened }),
    ref: (r: DropdownRef) => {
      innerRef.current = r?.isJunipero ? r.innerRef.current : r;
      refs.setReference(r?.isJunipero ? r.innerRef.current : r);
    },
    ...getReferenceProps({ onClick: (child as JSX.Element).props?.onClick }),
  });
}) as ForwardedProps<DropdownToggleRef, DropdownToggleProps>;

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
