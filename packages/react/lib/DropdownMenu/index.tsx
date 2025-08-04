import {
  type RefObject,
  type ReactNode,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { classNames, ensureNode } from '@junipero/core';
import { createPortal } from 'react-dom';

import type { TransitionProps } from '../Transition';
import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import { useAccessibility, useDropdown } from '../hooks';

export declare interface DropdownMenuRef extends JuniperoRef {
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface DropdownMenuProps
  extends SpecialComponentPropsWithRef<'div', DropdownMenuRef> {
  apparition?: string;
  autoFocus?: boolean;
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
  autoFocus = true,
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
    visible,
    container,
    getFloatingProps,
    onAnimationExit,
  } = useDropdown();
  const { onKeyDown, currentlyFocusedElement, toggleId } = useAccessibility();

  useEffect(() => {
    if (innerRef.current && autoFocus) {
      innerRef.current.focus();
    }
  }, [opened, autoFocus]);

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
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="listbox"
      aria-labelledby={toggleId}
      aria-activedescendant={currentlyFocusedElement}
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
