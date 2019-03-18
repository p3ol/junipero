import React from 'react';
import PropTypes from 'prop-types';
import { Reference } from 'react-popper';

import { omit, classNames } from './utils';

class DropdownToggle extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    tagRefName: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    tag: 'span',
    tagRefName: 'ref',
    onClick: () => {},
  }

  static contextTypes = {
    disabled: PropTypes.bool,
    theme: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  onClick(e) {
    if (this.props.disabled || this.context.disabled) {
      e?.preventDefault();
      return;
    }

    this.props.onClick(e);
    this.context.onToggle(e);
  }

  render() {
    const {
      className,
      tag: Tag,
      tagRefName,
      ...rest
    } = this.props;

    rest.disabled = rest.disabled || this.context.disabled;

    return (
      <Reference>
        { ({ ref }) => (
          <Tag
            { ...omit(rest, [
              'onClick',
            ]) }
            { ...{ [tagRefName]: ref} }
            className={classNames(
              'junipero',
              'junipero-dropdown-toggle',
              className,
            )}
            onClick={this.onClick.bind(this)}
          />
        ) }
      </Reference>
    );
  }

}

export default DropdownToggle;
