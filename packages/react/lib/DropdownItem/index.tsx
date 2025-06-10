import { type ComponentPropsWithoutRef, useId } from 'react';
import { classNames } from '@junipero/core';

import { useDropdown } from '../hooks';

export declare interface DropdownItemProps
  extends ComponentPropsWithoutRef<'li'> {}

const DropdownItem = ({
  className,
  ...rest
}: DropdownItemProps) => {
  const optionId = useId();
  const { setHighlightedOptionId } = useDropdown();

  return (
    <li
      key={optionId}
      className={classNames('dropdown-item', className)}
      role="option"
      tabIndex={0}
      onMouseEnter={() => setHighlightedOptionId(`option-${optionId}`)}
      { ...rest }
    />
  );
};

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
