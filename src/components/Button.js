import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles } from '../utils';
import styles from '../theme/components/Button.styl';

class Button extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    tag: PropTypes.string,
    type: PropTypes.string,
    submit: PropTypes.bool,
    reversed: PropTypes.bool,
    size: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    tag: 'a',
    type: 'default',
    submit: false,
    reversed: false,
    size: 'default',
    onClick: () => {},
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-button-styles', after: '#junipero-main-styles' });
  }

  onClick(e) {
    if (this.props.disabled) {
      return;
    }

    this.props.onClick(e);
  }

  render() {
    const {
      tag: Tag,
      submit,
      type,
      size,
      reversed,
      disabled,
      className,
      children,
    } = this.props;

    return (
      <Tag
        className={[
          'junipero',
          'button',
          type,
          reversed ? 'reversed' : null,
          disabled ? 'disabled' : null,
          `size-${size}`,
          className,
        ].join(' ')}
        onClick={this.onClick.bind(this)}
        type={submit ? 'submit' : Tag === 'button' ? 'button' : null}
        disabled={disabled}
      >
        { children }
      </Tag>
    );
  }

}

export default Button;
