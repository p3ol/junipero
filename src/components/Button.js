import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles, classNames } from '../utils';
import styles from '../theme/components/Button.styl';

class Button extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    innerRef: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
      PropTypes.string,
    ]),
    reversed: PropTypes.bool,
    size: PropTypes.string,
    submit: PropTypes.bool,
    tag: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    reversed: false,
    size: 'default',
    submit: false,
    tag: 'a',
    type: 'default',
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
      innerRef,
      ...rest
    } = this.props;

    return (
      <Tag
        { ...rest }
        className={classNames(
          'junipero',
          'junipero-button',
          'size-' + size,
          type,
          {
            reversed,
            disabled,
          },
          className,
        )}
        ref={innerRef}
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
