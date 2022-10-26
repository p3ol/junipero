import { forwardRef, useRef, useImperativeHandle } from 'react';
import { classNames, ensureNode } from '@junipero/core';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { useDropdown } from '../hooks';

const DropdownMenu = forwardRef(({
  animate,
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

  if (!opened && !animate) {
    return null;
  }

  const menu = (
    <ul className="menu-inner">
      { children }
    </ul>
  );

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
      { animate ? animate(menu, { opened }) : menu }
    </div>
  );

  return container ? createPortal(content, ensureNode(container)) : content;
});

DropdownMenu.displayName = 'DropdownMenu';
DropdownMenu.propTypes = {
  animate: PropTypes.func,
};

export default DropdownMenu;
