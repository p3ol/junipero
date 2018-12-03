import React from 'react';

const DropdownItem = ({ className, children, tag: Tag = 'li', ...rest }) => (
  <Tag
    { ...rest }
    className={[
      'junipero',
      'junipero-dropdown-item',
      className,
    ].join(' ')}
  >
    { children }
  </Tag>
);

export default DropdownItem;
