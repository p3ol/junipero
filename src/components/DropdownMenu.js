import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

import { getContainerNode, omit } from '../utils';

class DropdownMenu extends React.Component {

  static propTypes = {
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    modifiers: PropTypes.object,
    children: PropTypes.node.isRequired,
    apparition: PropTypes.oneOf(['insert', 'css']),
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    innerRef: PropTypes.func,
  }

  static defaultProps = {
    tag: 'ul',
    apparition: 'insert',
    ref: () => {},
  }

  static contextTypes = {
    isOpen: PropTypes.bool.isRequired,
    theme: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired,
  };

  innerRef = null;

  componentDidMount() {
    this.props.innerRef?.(this);
  }

  updatePopper() {
    this.scheduleUpdate?.();
  }

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
        { ({ ref, style, placement_, scheduleUpdate }) => {
          this.scheduleUpdate = scheduleUpdate;

          return (
            <Tag
              { ...omit(rest, [
                'innerRef',
              ]) }
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
          );
        }}
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
