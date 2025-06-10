import {
  type RefObject,
  type ReactNode,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { classNames, ensureNode } from '@junipero/core';
import { createPortal } from 'react-dom';

import type { TransitionProps } from '../Transition';
import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import { useDropdown } from '../hooks';

export declare interface DropdownMenuRef extends JuniperoRef {
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface DropdownMenuProps
  extends SpecialComponentPropsWithRef<'div', DropdownMenuRef> {
  apparition?: string;
  animate?(
    menu: ReactNode,
    opts: {
      opened: boolean;
    } & Partial<TransitionProps>
  ): ReactNode;
}

export const DropdownMenu = ({
  ref,
  apparition,
  children,
  className,
  animate,
  ...rest
}: DropdownMenuProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const {
    x,
    y,
    refs,
    strategy,
    opened,
    highlightedOptionId,
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

  innerRef.current?.focus();

  const menu = (
    <ul
      className="menu-inner"
      role="listbox"
      tabIndex={-1}
      aria-labelledby="dropdown-toggle"
      aria-activedescendant={highlightedOptionId}
    >
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
};

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
