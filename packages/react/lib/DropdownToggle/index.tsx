import {
  type MutableRefObject,
  type ComponentPropsWithRef,
  Children,
  forwardRef,
  cloneElement,
  useImperativeHandle,
  useRef,
} from 'react';
import { type ForwardedProps, classNames } from '@junipero/core';

import type { DropdownRef } from '../Dropdown';
import { useDropdown } from '../hooks';

export declare type DropdownToggleRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface DropdownToggleProps
  extends ComponentPropsWithRef<any> {
  children?: JSX.Element;
  ref?: MutableRefObject<DropdownToggleRef | undefined>;
}

const DropdownToggle = forwardRef(({
  children,
}: DropdownToggleProps, ref) => {
  const innerRef = useRef();
  const { opened, refs, getReferenceProps } = useDropdown();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const child = Children.only(children);

  return cloneElement(child, {
    className: classNames(child.props.className, 'dropdown-toggle', { opened }),
    ref: (r: DropdownRef) => {
      innerRef.current = r?.isJunipero ? r.innerRef.current : r;
      refs.setReference(r?.isJunipero ? r.innerRef.current : r);
    },
    ...getReferenceProps({ onClick: child.props.onClick }),
  });
}) as ForwardedProps<DropdownToggleProps, DropdownToggleRef>;

DropdownToggle.displayName = 'DropdownToggle';
DropdownToggle.propTypes = {};

export default DropdownToggle;
