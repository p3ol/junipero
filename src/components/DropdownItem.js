import React from 'react';

const DropdownItem = ({ className, children, ...rest }) => (
  <li
    { ...rest }
    className={[
      'junipero',
      'junipero-dropdown-item',
      className,
    ].join(' ')}
  >
    { children }
  </li>
);

export default DropdownItem;
