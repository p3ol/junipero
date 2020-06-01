import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';

import { classNames } from '../utils';

const DropdownItem = forwardRef(({
  className,
  tag: Tag = 'li',
  ...rest
}, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  return (
    <Tag
      { ...rest }
      className={classNames(
        'junipero',
        'dropdown-item',
        className,
      )}
      ref={innerRef}
    />
  );
});

DropdownItem.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default DropdownItem;
