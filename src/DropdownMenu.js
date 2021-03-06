import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

import { getContainerNode, omit, classNames } from './utils';

export default class DropdownMenu extends React.Component {

  static propTypes = {
    apparition: PropTypes.oneOf(['insert', 'css']),
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    modifiers: PropTypes.array,
    tag: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.object,
      PropTypes.node,
    ]),
    animate: PropTypes.func,
  }

  static defaultProps = {
    apparition: 'insert',
    modifiers: [],
    tag: 'div',
  }

  static contextTypes = {
    isOpen: PropTypes.bool.isRequired,
    theme: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired,
  };

  innerRef = null;

  updatePopper () {
    this.scheduleUpdate?.();
  }

  render () {
    const {
      className,
      tag: Tag,
      modifiers,
      apparition,
      container,
      animate,
      children,
      ...rest
    } = this.props;

    const {
      isOpen,
      theme,
      placement,
    } = this.context;

    if (!isOpen && !animate && apparition === 'insert') {
      return false;
    }

    const menu = (
      <Popper
        placement={placement}
        modifiers={[
          ...modifiers,
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
        ]}
        innerRef={ref => { this.innerRef = ref; }}
      >
        { ({ ref, style, placement_, update }) => {
          this.scheduleUpdate = update;

          return (
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
                  opened: !animate && isOpen,
                  closed: !animate && !isOpen,
                },
                className,
              )}
              data-placement={placement_}
            >
              <ul className="junipero junipero-dropdown-menu-inner">
                { children }
              </ul>
            </Tag>
          );
        }}
      </Popper>
    );

    if (container) {
      return ReactDOM.createPortal(
        animate ? animate(menu) : menu,
        getContainerNode(container)
      );
    } else {
      return animate ? animate(menu) : menu;
    }
  }

}
