import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

const DropdownItem = forwardRef(({
  className,
  tag: Tag = 'li',
  ...rest
}, ref) => (
  <Tag
    { ...rest }
    className={classNames(
      'junipero',
      'dropdown-item',
      className,
    )}
    ref={ref}
  />
));

DropdownItem.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default DropdownItem;
