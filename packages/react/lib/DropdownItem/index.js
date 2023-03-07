import { classNames } from '@junipero/core';

const DropdownItem = ({ className, ...rest }) => (
  <li className={classNames('dropdown-item', className)} {...rest} />
);

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
