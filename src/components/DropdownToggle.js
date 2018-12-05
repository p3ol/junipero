import React from 'react';
import PropTypes from 'prop-types';
import { Reference } from 'react-popper';

import { omit, classNames } from '../utils';
import Button from './Button';

class DropdownToggle extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    tagRefName: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    tagRefName: 'ref',
    className: '',
    onClick: () => {},
  }

  static contextTypes = {
    disabled: PropTypes.bool,
    theme: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  onClick(e) {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }

    this.props.onClick(e);
    this.context.onToggle(e);
  }

  render() {
    const {
      className,
      tag,
      ...rest
    } = this.props;

    const Tag = tag || Button;

    if (!tag) {
      rest.tagRefName = 'innerRef';
      rest.theme = this.context.theme;
      rest.type = 'primary';
    }

    rest.disabled = rest.disabled || this.context.disabled;

    return (
      <Reference>
        { ({ ref }) => (
          <Tag
            { ...omit(rest, [
              'onClick', 'tagRefName',
            ]) }
            { ...{ [rest.tagRefName]: ref } }
            className={classNames(
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
