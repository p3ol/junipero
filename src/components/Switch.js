import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import { injectStyles, omit } from '../utils';
import styles from '../theme/components/Switch.styl';

class Switch extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    theme: PropTypes.string,
    options: PropTypes.array,
    type: PropTypes.string,
    validate: PropTypes.func,
    parseValue: PropTypes.func,
    parseTitle: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    theme: 'default',
    options: [],
    type: 'primary',
    validate: value => typeof value !== undefined && value !== null,
    parseValue: (val) => val,
    parseTitle: (val) => val,
    onChange: () => {},
  }

  state = {
    value: null,
    valid: true,
  }

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
        className={[
          'junipero',
          'switch',
          'theme-' + theme,
          disabled ? 'disabled' : null,
          className,
        ].join(' ')}
      >
        { options.map((option, index) => (
          <Button
            { ...omit(rest, [
              'validate', 'parseValue', 'onChange',
            ]) }
            className={[
              this.isActive(option) ? 'active' : null,
            ].join(' ')}
            key={index}
            theme={theme}
            disabled={disabled}
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
