import {
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useId,
  useMemo,
} from 'react';
import { classNames } from '@junipero/core';

import { useDropdown } from '../hooks';

export declare interface DropdownItemProps
  extends ComponentPropsWithoutRef<'li'> {}

const DropdownItem = ({
  id: idProp,
  className,
  tabIndex = 0,
  onMouseEnter,
  onFocus,
  onKeyDown,
  ...rest
}: DropdownItemProps) => {
  const { activeItem, menuId, setActiveItem } = useDropdown();
  const fallbackId = useId();
  const id = useMemo(() => (
    idProp ??
    (menuId
      ? `${menuId}-${fallbackId}`
      : `junipero-dropdown-item-${fallbackId}`)
  ), [idProp, fallbackId, menuId]);

  const onMouseEnter_ = useCallback((e: MouseEvent<HTMLLIElement>) => {
    setActiveItem?.(id);
    onMouseEnter?.(e);
  }, [id, onMouseEnter, setActiveItem]);

  const onFocus_ = useCallback((e: FocusEvent<HTMLLIElement>) => {
    setActiveItem?.(id);
    onFocus?.(e);
  }, [id, onFocus, setActiveItem]);

  const onKeyDown_ = useCallback((e: KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      (e.target as HTMLLIElement)
        .querySelector<HTMLAnchorElement>('a, button')?.click();
    }

    onKeyDown?.(e);
  }, [onKeyDown]);

  return (
    <li
      { ...rest }
      tabIndex={tabIndex}
      id={id}
      className={classNames(
        'junipero dropdown-item',
        className,
        { active: id === activeItem }
      )}
      onMouseEnter={onMouseEnter_}
      onFocus={onFocus_}
      onKeyDown={onKeyDown_}
    />
  );
};

DropdownItem.displayName = 'DropdownItem';

export default DropdownItem;
