import React from 'react';
import PropTypes from 'prop-types';

import './TextField.styl';

const propTypes = {
  value: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  validate: PropTypes.func,
};

const defaultProps = {
  value: '',
  type: 'text',
  label: '',
  placeholder: '',
  disabled: false,
  required: false,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  validate: (value) => /.+/g.test(value),
};

class TextField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
      value: this.props.value || '',
      valid: this.props.valid || true,
    };
  }

  onFocus(e) {
    this.props.onFocus(e);

    if (
      e.defaultPrevented ||
      e.isImmediatePropagationStopped ||
      e.isPropagationStopped
    ) {
      return false;
    }

    this.setState({ focused: true });
    return true;
  }

  onBlur(e) {
    this.props.onBlur(e);

    if (
      e.defaultPrevented ||
      e.isImmediatePropagationStopped ||
      e.isPropagationStopped
    ) {
      return false;
    }

    this.setState({ focused: false });
    return true;
  }

  onChange(e) {
    const value = e.target.value;
    const valid = this.props.validate(value);

    this.setState({
      value,
      valid,
    }, () => {
      this.props.onChange({
        value,
        valid,
      });
    });
  }

  render() {
    return (
      <div
        className={[
          'udf-text-field',
          !this.state.valid && 'udf-invalid',
          this.props.required && 'udf-required',
          this.props.placeholder && 'udf-placeholder',
        ].join(' ')}
      >
        <input
          type={this.props.type}
          disabled={this.props.disabled}
          required={this.props.required}
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onChange={this.onChange.bind(this)}
        />
      </div>
    );
  }
}

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;
