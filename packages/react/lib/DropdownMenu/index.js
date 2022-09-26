import { forwardRef, useRef, useImperativeHandle } from 'react';
import { classNames, ensureNode } from '@junipero/core';
import { createPortal } from 'react-dom';

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
    container,
  } = useDropdown();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  if (!opened) {
    return null;
  }

  const content = (
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

  return container ? createPortal(content, ensureNode(container)) : content;
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
