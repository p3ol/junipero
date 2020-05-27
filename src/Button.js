import React from 'react';
import PropTypes from 'prop-types';

import { inject } from './style';
import { classNames } from './utils';
import styles from './theme/components/Button.styl';

export default class Button extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    reversed: PropTypes.bool,
    size: PropTypes.string,
    submit: PropTypes.bool,
    tag: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.object,
    ]),
    theme: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    reversed: false,
    size: 'default',
    submit: false,
    tag: 'a',
    theme: 'default',
    type: 'default',
    onClick: () => {},
  }

  innerRef = null

  constructor (props) {
    super(props);
    inject(styles, 'junipero-button-styles');
  }

  onClick (e) {
    if (this.props.disabled) {
      return;
    }

    this.props.onClick(e);
  }

  render () {
    const {
      tag: Tag,
      submit,
      type,
      size,
      reversed,
      disabled,
      className,
      children,
      theme,
      ...rest
    } = this.props;

    return (
      <Tag
        { ...rest }
        className={classNames(
          'junipero',
          'junipero-button',
          'size-' + size,
          'theme-' + theme,
          type,
          {
            reversed,
            disabled,
          },
          className,
        )}
        ref={ref => { this.innerRef = ref; }}
        onClick={this.onClick.bind(this)}
        type={submit ? 'submit' : Tag === 'button' ? 'button' : null}
        disabled={disabled}
      >
        { children }
      </Tag>
    );
  }

}
