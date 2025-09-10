import {
  type RefObject,
  type ReactNode,
  type KeyboardEvent,
  useRef,
  useImperativeHandle,
  useId,
  useMemo,
  useLayoutEffect,
} from 'react';
import { classNames, ensureNode } from '@junipero/core';
import { useEventListener } from '@junipero/hooks';
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
  id: idProp,
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
    visible,
    container,
    fallbackMenuId,
    activeItem,
    getFloatingProps,
    onAnimationExit,
    registerMenu,
  } = useDropdown();
  const fallbackId = useId();
  const id = useMemo(() => (
    idProp ?? fallbackMenuId ?? `junipero-dropdown-menu-${fallbackId}`
  ), [idProp, fallbackMenuId, fallbackId]);

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  useLayoutEffect(() => {
    if (idProp) {
      registerMenu?.(idProp);
    }
  }, [idProp, registerMenu]);

  useEventListener('keydown', (e: KeyboardEvent) => {
    if (!opened || !['ArrowDown', 'ArrowUp'].includes(e.key)) {
      return;
    }

    const items = innerRef.current?.querySelectorAll<HTMLElement>(
      '.junipero.dropdown-item:not(.disabled):not([tabindex="-1"])'
    );

    if (e.key === 'ArrowDown') {
      e.stopPropagation();
      e.preventDefault();

      if (!activeItem) {
        items?.[0]?.focus();
      } else {
        const current = Array.from(items).findIndex(i => i.id === activeItem);

        if (current >= 0 && current < (items.length - 1)) {
          items[current + 1]?.focus();
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.stopPropagation();
      e.preventDefault();

      if (!activeItem) {
        items?.[items.length - 1]?.focus();
      } else {
        const current = Array.from(items).findIndex(i => i.id === activeItem);

        if (current > 0) {
          items[current - 1]?.focus();
        }
      }
    }
  }, [opened, activeItem]);

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
      id={id}
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
