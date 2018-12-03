import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

import { getContainerNode } from '../utils';

class DropdownMenu extends React.Component {

  static propTypes = {
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    modifiers: PropTypes.object,
    children: PropTypes.node.isRequired,
    apparition: PropTypes.oneOf(['insert', 'css']),
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }

  static defaultProps = {
    tag: 'ul',
    apparition: 'insert',
  }

  static contextTypes = {
    isOpen: PropTypes.bool.isRequired,
    theme: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired,
  };

  innerRef = null;

  render() {
    const {
      className,
      tag: Tag,
      modifiers,
      apparition,
      container,
      ...rest
    } = this.props;

    const {
      isOpen,
      theme,
      placement,
    } = this.context;

    if (!isOpen && apparition === 'insert') {
      return false;
    }

    const menu = (
      <Popper
        placement={placement}
        modifiers={modifiers}
        innerRef={(ref) => this.innerRef = ref}
      >
        { ({ ref, style, placement_ }) => (
          <Tag
            { ...rest }
            ref={ref}
            style={style}
            className={[
              'junipero',
              'junipero-dropdown-menu',
              'theme-' + theme,
              isOpen ? 'opened' : null,
              className,
            ].join(' ')}
            data-placement={placement_}
          />
        )}
      </Popper>
    );

    if (container) {
      return ReactDOM.createPortal(menu, getContainerNode(container));
    } else {
      return menu;
    }
  }

}

export default DropdownMenu;
