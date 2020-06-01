import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useContext,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { classNames, ensureNode } from '../utils';
import { DropdownContext } from '../contexts';

const DropdownMenu = forwardRef(({
  children,
  className,
  container,
  animate,
  tag: Tag = 'ul',
  ...rest
}, ref) => {
  const innerRef = useRef();
  const { opened, styles, attributes } = useContext(DropdownContext);

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  if (!opened && !animate) {
    return null;
  }

  const menu = (
    <Tag className="menu-inner">{ children }</Tag>
  );

  const wrapper = (
    <div
      href="#"
      { ...rest }
      className={classNames(
        'junipero',
        'dropdown-menu',
        {
          opened,
        },
        className,
      )}
      style={styles.popper}
      { ...attributes.popper || {} }
      ref={innerRef}
    >
      { animate ? animate(menu, { opened }) : menu }
    </div>
  );

  return container
    ? createPortal(wrapper, ensureNode(container))
    : wrapper;
});

DropdownMenu.propTypes = {
  container: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
  ]),
  animate: PropTypes.func,
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
  ]),
};

export default DropdownMenu;
