import { forwardRef, useRef, useImperativeHandle } from 'react';
import { classNames } from '@junipero/core';

import { useDropdown } from '../hooks';

const DropdownMenu = forwardRef(({
  children,
  className,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const {
    x,
    y,
    floating,
    strategy,
    opened,
    getFloatingProps,
  } = useDropdown();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  if (!opened) {
    return null;
  }

  return (
    <div
      { ...rest }
      ref={floating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        ...rest.style || {},
      }}
      className={classNames('junipero dropdown-menu', className)}
      { ...getFloatingProps() }
    >
      <ul className="menu-inner">
        { children }
      </ul>
    </div>
  );
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
