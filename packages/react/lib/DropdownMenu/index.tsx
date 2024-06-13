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

import type { TransitionProps } from '../Transition';
import type { JuniperoRef } from '../types';
import { useDropdown } from '../hooks';

export declare interface DropdownMenuRef extends JuniperoRef {
  isJunipero: boolean;
  innerRef: MutableRefObject<HTMLDivElement>;
}

export declare interface DropdownMenuProps
  extends ComponentPropsWithRef<'div'> {
  apparition?: string;
  animate?(
    menu: ReactNode | JSX.Element,
    opts: {
      opened: boolean;
    } & Partial<TransitionProps>
  ): ReactNode | JSX.Element;
}

export const DropdownMenu = forwardRef<DropdownMenuRef, DropdownMenuProps>(({
  animate,
  apparition,
  children,
  className,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLDivElement>();
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
      ref={r => {
        refs.setFloating?.(r);
        innerRef.current = r;
      }}
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

export default DropdownMenu;
