import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

import { getContainerNode, omit, classNames } from '../utils';

class DropdownMenu extends React.Component {

  static propTypes = {
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    modifiers: PropTypes.object,
    children: PropTypes.node.isRequired,
    apparition: PropTypes.oneOf(['insert', 'css']),
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    innerRef: PropTypes.func,
    animate: PropTypes.func,
  }

  static defaultProps = {
    tag: 'ul',
    apparition: 'insert',
    ref: () => {},
    animate: menu => menu,
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
      animate,
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

          return animate(
            <Tag
              { ...omit(rest, [
                'innerRef',
              ]) }
              ref={ref}
              style={style}
              className={classNames(
                'junipero',
                'junipero-dropdown-menu',
                'theme-' + theme,
                {
                  opened: isOpen,
                },
                className,
              )}
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
