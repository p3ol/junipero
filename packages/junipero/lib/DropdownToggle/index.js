import {
  forwardRef,
  useContext,
  useMemo,
  useId } from 'react';
import PropTypes from 'prop-types';
import { classNames } from '@poool/junipero-utils';

import { DropdownContext } from '../contexts';

const DropdownToggle = forwardRef(({
  tag: Tag = 'a',
  id: idProp,
  className,
  trigger = 'click',
  a11yEnabled = true,
  onClick = () => {},
  ...rest
}, ref) => {
  const {
    disabled,
    toggle,
    menuId,
    opened,
    fallbackMenuId,
    activeItem,
  } = useContext(DropdownContext);

  const fallbackId = useId();
  const id = useMemo(() => (
    idProp ?? `junipero-dropdown-toggle-${fallbackId}`
  ), [idProp, fallbackId]);

  const onClick_ = e => {
    e?.preventDefault();

    if (disabled || trigger === 'manual') {
      return;
    }

    toggle();
    onClick(e);
  };

  return (
    <Tag
      href="#"
      { ...rest }
      className={classNames(
        'junipero',
        'dropdown-toggle',
        className,
      )}
      id={id}
      {...a11yEnabled && {
        dir: 'ltr',
        role: 'combobox',
        'aria-controls': menuId ?? fallbackMenuId,
        'aria-expanded': opened,
        'aria-activedescendant': activeItem,
        'aria-haspopup': 'listbox',
        'aria-autocomplete': 'none',
      }}
      ref={ref}
      onClick={onClick_}
    />
  );
});

DropdownToggle.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  id: PropTypes.string,
  a11yEnabled: PropTypes.bool,
  trigger: PropTypes.oneOf(['click', 'manual']),
  onClick: PropTypes.func,
};

export default DropdownToggle;
