import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import { injectStyles, omit, classNames } from '../utils';
import styles from '../theme/components/Switch.styl';

class Switch extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    options: PropTypes.array,
    theme: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func,
    parseTitle: PropTypes.func,
    parseValue: PropTypes.func,
    validate: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    options: [],
    theme: 'default',
    type: 'primary',
    onChange: () => {},
    parseTitle: (val) => val,
    parseValue: (val) => val,
    validate: value => typeof value !== undefined && value !== null,
  }

  state = {
    value: null,
    valid: true,
  }

  buttons = []

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-switch-styles', after: '#junipero-main-styles' });
  }

  componentDidMount() {
    this.onChange(this.props.value, false);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.onChange(this.props.value);
    }
  }

  onChange(option, propagateChange = true) {
    if (option?.disabled || this.props.disabled) {
      return;
    }

    const { validate, onChange, parseValue } = this.props;
    const value = parseValue(option);
    const valid = validate(value);

    this.setState({
      value,
      valid,
    }, () => {
      if (propagateChange) {
        onChange({
          value,
          valid,
        });
      }
    });
  }

  isActive(option) {
    return this.state.value === this.props.parseValue(option);
  }

  render() {
    const {
      disabled,
      theme,
      options,
      parseTitle,
      className,
      ...rest
    } = this.props;

    return (
      <div
        className={classNames(
          'junipero',
          'junipero-switch',
          'theme-' + theme,
          { disabled },
          className,
        )}
      >
        { options.map((option, index) => (
          <Button
            { ...omit(rest, [
              'validate', 'parseValue', 'onChange',
            ]) }
            ref={(ref) => this.buttons[index] = ref}
            className={classNames({
              selected: this.isActive(option),
            })}
            key={index}
            theme={theme}
            disabled={option.disabled || disabled}
            reversed={true}
            onClick={this.onChange.bind(this, option)}
          >
            { parseTitle(option) }
          </Button>
        ))}
      </div>
    );
  }

}

export default Switch;
