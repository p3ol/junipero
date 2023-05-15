import {
  Children,
  forwardRef,
  cloneElement,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import { useDropdown } from '../hooks';

const DropdownToggle = forwardRef(({
  children,
}, ref) => {
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
});

DropdownToggle.displayName = 'DropdownToggle';
DropdownToggle.propTypes = {};

export default DropdownToggle;
