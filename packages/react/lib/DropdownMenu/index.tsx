import {
  type ComponentPropsWithRef,
  type MutableRefObject,
  type ReactNode,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import { classNames, ensureNode } from '@junipero/core';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { useDropdown } from '../hooks';

export declare type DropdownMenuRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface DropdownMenuProps extends ComponentPropsWithRef<any> {
  apparition?: string;
  children?: ReactNode | JSX.Element;
  className?: string;
  animate?(
    menu: ReactNode | JSX.Element,
    opts: { opened: boolean, onExited: (opened: boolean) => void }
  ): ReactNode | JSX.Element;
  ref?: MutableRefObject<DropdownMenuRef | undefined>;
}

export const DropdownMenu = forwardRef(({
  animate,
  apparition,
  children,
  className,
  ...rest
}: DropdownMenuProps, ref) => {
  const innerRef = useRef();
  const {
    x,
    y,
    refs,
    strategy,
    opened,
    visible,
    container,
    getFloatingProps,
    onAnimationExit,
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
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        ...rest.style || {},
      }}
      className={classNames('junipero dropdown-menu', className)}
      { ...getFloatingProps() }
    >
      { animate ? animate(menu, {
        opened,
        onExited: onAnimationExit,
      }) : menu }
    </div>
  );

  return opened || (animate && visible) || apparition === 'css'
    ? container ? createPortal(content, ensureNode(container))
      : content
    : null;
});

DropdownMenu.displayName = 'DropdownMenu';
DropdownMenu.propTypes = {
  animate: PropTypes.func,
  apparition: PropTypes.string,
};

export default DropdownMenu;
