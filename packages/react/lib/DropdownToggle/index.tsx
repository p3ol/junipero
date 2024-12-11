import {
  type RefObject,
  type ReactElement,
  type ComponentPropsWithoutRef,
  Children,
  cloneElement,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  JuniperoInnerRef,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import { useDropdown } from '../hooks';

export declare interface DropdownToggleRef extends JuniperoRef {
  innerRef: RefObject<JuniperoRef | JuniperoInnerRef>;
}

export declare interface DropdownToggleProps
  extends SpecialComponentPropsWithRef<any, DropdownToggleRef> {}

const DropdownToggle = ({
  ref,
  children,
}: DropdownToggleProps) => {
  const innerRef = useRef<JuniperoRef | JuniperoInnerRef>(null);
  const { opened, refs, getReferenceProps } = useDropdown();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const child = Children
    .only<ReactElement<ComponentPropsWithoutRef<any>>>(children);

  return cloneElement(child, {
    className: classNames(
      child.props?.className, 'dropdown-toggle', { opened }
    ),
    ref: (r: JuniperoRef | JuniperoInnerRef) => {
      innerRef.current = (r as JuniperoRef)?.isJunipero
        ? (r as JuniperoRef).innerRef.current : r;
      refs.setReference(
        (r as JuniperoRef)?.isJunipero
          ? (r as JuniperoRef).innerRef.current : r
      );
    },
    ...getReferenceProps({ onClick: child.props?.onClick }),
  });
};

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
