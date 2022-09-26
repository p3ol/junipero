import {
  Children,
  forwardRef,
  cloneElement,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { useDropdown } from '../hooks';

const DropdownToggle = forwardRef(({
  children,
  onClick,
}, ref) => {
  const innerRef = useRef();
  const {
    opened,
    reference,
    getReferenceProps,
  } = useDropdown();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const child = Children.only(children);

  return cloneElement(child, {
    className: classNames(child.props.className, 'dropdown-toggle', { opened }),
    ref: r => {
      innerRef.current = r?.isJunipero ? r.innerRef.current : r;
      reference(r?.isJunipero ? r.innerRef.current : r);
    },
    ...getReferenceProps({ onClick }),
  });
});

DropdownToggle.displayName = 'DropdownToggle';
DropdownToggle.propTypes = {
  onClick: PropTypes.func,
};

export default DropdownToggle;
