import {
  forwardRef,
  useContext,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { classNames, ensureNode } from '@poool/junipero-utils';

import { DropdownContext } from '../contexts';

const DropdownMenu = forwardRef(({
  children,
  className,
  container,
  animate,
  apparition = 'insert',
  tag: Tag = 'ul',
  ...rest
}, ref) => {
  const { opened, styles, attributes } = useContext(DropdownContext);

  if (!opened && !animate && apparition === 'insert') {
    return null;
  }

  const menu = (
    <Tag className="menu-inner">{ children }</Tag>
  );

  const wrapper = (
    <div
      { ...rest }
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
      ref={ref}
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
