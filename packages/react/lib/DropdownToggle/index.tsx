import {
  Children,
  forwardRef,
  cloneElement,
  useImperativeHandle,
  useRef,
  MutableRefObject,
  ComponentPropsWithRef,
} from 'react';
import { classNames } from '@junipero/core';

import { useDropdown } from '../hooks';
import { ForwardedProps } from '../utils';

export declare type DropdownToggleRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface DropdownToggleProps extends ComponentPropsWithRef<any> {
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
    ref: r => {
      innerRef.current = r?.isJunipero ? r.innerRef.current : r;
      refs.setReference(r?.isJunipero ? r.innerRef.current : r);
    },
    ...getReferenceProps({ onClick: child.props.onClick }),
  });
}) as ForwardedProps<DropdownToggleProps, DropdownToggleRef>;

DropdownToggle.displayName = 'DropdownToggle';
DropdownToggle.propTypes = {};

export default DropdownToggle;
