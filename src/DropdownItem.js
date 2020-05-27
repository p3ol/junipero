import React from 'react';
import PropTypes from 'prop-types';

import { classNames } from './utils';

const DropdownItem = ({ className, children, tag: Tag = 'li', ...rest }) => (
  <Tag
    { ...rest }
    className={classNames(
      'junipero',
      'junipero-dropdown-item',
      className,
    )}
  >
    { children }
  </Tag>
);

DropdownItem.propTypes = {
  tag: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.node,
    React.Node,
  ]),
};

export default DropdownItem;
