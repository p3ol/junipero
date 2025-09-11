import { useMemo, useId, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

import { DropdownContext } from '../contexts';

const DropdownItem = ({
  id: idProp,
  className,
  tabIndex = 0,
  onMouseEnter,
  onFocus,
  onKeyDown,
  ...rest
}) => {
  const { activeItem, menuId, setActiveItem } = useContext(DropdownContext);
  const fallbackId = useId();
  const id = useMemo(() => (
    idProp ??
    (menuId
      ? `${menuId}-${fallbackId}`
      : `junipero-dropdown-item-${fallbackId}`)
  ), [idProp, fallbackId, menuId]);

  const onMouseEnter_ = useCallback(e => {
    setActiveItem?.(id);
    onMouseEnter?.(e);
  }, [id, onMouseEnter, setActiveItem]);

  const onFocus_ = useCallback(e => {
    setActiveItem?.(id);
    onFocus?.(e);
  }, [id, onFocus, setActiveItem]);

  const onKeyDown_ = useCallback(e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.target.querySelector('a, button')?.click();
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

DropdownItem.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  onMouseEnter: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default DropdownItem;
