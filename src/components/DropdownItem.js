import React from 'react';

import { classNames } from '../utils';

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

export default DropdownItem;
