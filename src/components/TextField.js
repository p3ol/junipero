import React from 'react';
import PropTypes from 'prop-types';

import '../theme/components/TextField.styl';

const propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  boxed: PropTypes.bool,
  prefix: PropTypes.object,
  suffix: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  validate: PropTypes.func,
};

const defaultProps = {
  className: null,
  value: '',
  type: 'text',
  label: '',
  placeholder: '',
  disabled: false,
  required: false,
  boxed: false,
  prefix: null,
  suffix: null,
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
      (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) ||
      (e.isPropagationStopped && e.isPropagationStopped())
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
      (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) ||
      (e.isPropagationStopped && e.isPropagationStopped())
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

  reset() {
    this.setState({
      focused: false,
      value: this.props.value || '',
      valid: this.props.valid || true,
    }, () => {
      this.props.onChange({});
    });
  }

  render() {
    return (
      <div
        className={[
          'udf',
          'text-field',
          this.state.focused ? 'focused' : null,
          this.state.value ? 'dirty' : null,
          !this.state.valid ? 'invalid' : null,
          this.props.disabled ? 'disabled' : null,
          this.props.required ? 'required' : null,
          this.props.placeholder ? 'placeholder' : null,
          this.props.boxed ? 'boxed' : null,
          this.props.className,
        ].join(' ')}
      >

        <div className="input-wrapper">
          { this.props.prefix && (
            <div className="input-prefix">{ this.props.prefix }</div>
          ) }

          <div className="input-inner">
            <input
              type={this.props.type}
              disabled={this.props.disabled}
              required={this.props.required}
              placeholder={this.props.placeholder}
              value={this.state.value}
              onFocus={this.onFocus.bind(this)}
              onBlur={this.onBlur.bind(this)}
              onChange={this.onChange.bind(this)}
            />

            { this.props.label && (
              <span className="label">{ this.props.label }</span>
            ) }
          </div>

          { this.props.suffix && (
            <div className="input-suffix">{ this.props.suffix }</div>
          ) }
        </div>

        { this.props.error && (
          <span className="error">{ this.props.error }</span>
        ) }
      </div>
    );
  }
}

TextField.propTypes = propTypes;
TextField.defaultProps = defaultProps;

export default TextField;
