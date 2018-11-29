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

  onOptionClick(option, index) {
    const { validate, onChange, parseValue } = this.props;
    const value = parseValue(option);
    const valid = validate(value);

    this.setState({
      value,
      valid,
    }, () => {
      onChange({
        value,
        valid,
      });
    });
  }

  isActive(option) {
    const { parseValue } = this.props;

    return this.state.value === option;
  }

  render() {
    const { disabled, theme, options, parseTitle, ...rest } = this.props;

    return (
      <div
        className={[
          'junipero',
          'switch',
          'theme-' + theme,
          disabled ? 'disabled' : null,
        ].join(' ')}
      >
        { options.map((option, index) => (
          <Button
            { ...omit(rest, [
              'validate', 'parseValue',
            ]) }
            key={index}
            theme={theme}
            disabled={disabled}
            reversed={!this.isActive(option)}
            onClick={this.onOptionClick.bind(this, option, index)}
          >
            { parseTitle(option) }
          </Button>
        ))}
      </div>
    );
  }

}

export default Switch;
