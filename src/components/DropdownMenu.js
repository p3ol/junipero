import React from 'react';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

class DropdownMenu extends React.Component {

  static propTypes = {
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    modifiers: PropTypes.object,
    children: PropTypes.node.isRequired,
    apparition: PropTypes.oneOf(['insert', 'css']),
  }

  static defaultProps = {
    tag: 'ul',
    apparition: 'insert',
  }

  static contextTypes = {
    isOpen: PropTypes.bool.isRequired,
    placement: PropTypes.string.isRequired,
  };

  render() {
    const {
      className,
      tag: Tag,
      modifiers,
      apparition,
      ...rest
    } = this.props;

    if (!this.context.isOpen && apparition === 'insert') {
      return false;
    }

    return (
      <Popper
        placement={this.context.placement}
        modifiers={modifiers}
      >
        { ({ ref, style, placement }) => (
          <Tag
            { ...rest }
            ref={ref}
            style={style}
            className={[
              'junipero-dropdown-menu',
              className,
            ].join(' ')}
            data-placement={placement}
          />
        )}
      </Popper>
    );
  }

}

export default DropdownMenu;
