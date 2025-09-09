import {
  forwardRef,
  useContext,
  useId,
  useLayoutEffect,
  useMemo } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { classNames, ensureNode } from '@poool/junipero-utils';
import { useEventListener } from '@poool/junipero-hooks';

import { DropdownContext } from '../contexts';

const DropdownMenu = forwardRef(({
  children,
  id: idProp,
  className,
  animate,
  apparition = 'insert',
  tag: Tag = 'ul',
  ...rest
}, ref) => {

  const {
    opened,
    container,
    fallbackMenuId,
    activeItem,
    registerMenu,
    styles,
    attributes,
  } = useContext(DropdownContext);

  const fallbackId = useId();
  const id = useMemo(() => (
    idProp ?? fallbackMenuId ?? `junipero-dropdown-menu-${fallbackId}`
  ), [idProp, fallbackMenuId, fallbackId]);

  useLayoutEffect(() => {
    if (idProp) {
      registerMenu?.(idProp);
    }
  }, [idProp, registerMenu]);

  useEventListener('keydown', e => {
    if (!opened || !['ArrowDown', 'ArrowUp'].includes(e.key)) {
      return;
    }

    const items = ref.current?.querySelectorAll(
      '.junipero.dropdown-item:not(.disabled):not([tabindex="-1"])'
    );
    console.log(activeItem);

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

  if (!opened && !animate && apparition === 'insert') {
    return null;
  }

  const menu = (
    <Tag className="menu-inner">{ children }</Tag>
  );

  const wrapper = (
    <div
      { ...rest }
      id={id}
      className={classNames(
        'junipero',
        'dropdown-menu',
        {
          'apparition-css': apparition === 'css',
          opened,
        },
        className,
      )}
      style={styles?.popper || {}}
      { ...attributes?.popper || {} }
      ref={r => { ref.current = r; }}
    >
      { animate ? animate(menu, { opened }) : menu }
    </div>
  );

  return container
    ? createPortal(wrapper, ensureNode(container))
    : wrapper;
});

DropdownMenu.propTypes = {
  apparition: PropTypes.oneOf(['insert', 'css']),
  id: PropTypes.string,
  container: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
  ]),
  animate: PropTypes.func,
  tag: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default DropdownMenu;
