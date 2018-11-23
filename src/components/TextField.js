import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles } from '../utils';
import styles from '../theme/components/TextField.styl';

class TextField extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool,
    ]),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    boxed: PropTypes.bool,
    rows: PropTypes.number,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    validate: PropTypes.func,
    theme: PropTypes.string,
  }

  static defaultProps = {
    className: null,
    value: '',
    type: 'text',
    label: '',
    placeholder: '',
    disabled: false,
    required: false,
    boxed: false,
    rows: null,
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
    validate: value => /.+/g.test(value),
    theme: 'default',
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-text-field-styles', after: '#junipero-main-styles' });

    this.state = {
      focused: false,
      dirty: !!this.props.value,
      value: this.props.value || '',
      valid: this.props.valid || true,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.props.value,
        dirty: !!this.props.value,
      });
    }
  }

  onFocus(e) {
    this.props.onFocus(e);
    const { value } = this.state;

    if (
      e.defaultPrevented ||
      (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) ||
      (e.isPropagationStopped && e.isPropagationStopped())
    ) {
      return false;
    }

    this.setState({
      focused: true,
      dirty: !!value,
    });
    return true;
  }

  onBlur(e) {
    this.props.onBlur(e);
    const { value } = this.state;

    if (
      e.defaultPrevented ||
      (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) ||
      (e.isPropagationStopped && e.isPropagationStopped())
    ) {
      return false;
    }

    this.setState({
      focused: false,
      dirty: !!value,
    });

    return true;
  }

  onChange(e) {
    e.persist();
    let value = e.target.value;
    const valid = this.props.validate(value);

    this.setState({
      value,
      valid,
      dirty: true,
    }, () => {
      if (typeof this.props.value === 'number') {
        value = Number(value) || 0;
      }

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

  focus() {
    this.input?.focus();
  }

  blur() {
    this.input?.blur();
  }

  getType() {
    return this.props.type === 'password' ? this.props.type : 'text';
  }

  render() {
    const { focused, value, valid, dirty } = this.state;

    const {
      disabled,
      required,
      boxed,
      className,
      placeholder,
      label,
      theme,
      ...rest
    } = this.props;

    const Tag = rest.rows > 1 ? 'textarea' : 'input';

    return (
      <div
        className={[
          'junipero',
          'junipero-field',
          'text-field',
          'theme-' + theme,
          label !== false && (label || placeholder) ? 'with-label' : null,
          focused ? 'focused' : null,
          dirty ? 'dirty' : null,
          !valid ? 'invalid' : null,
          disabled ? 'disabled' : null,
          required ? 'required' : null,
          boxed ? 'boxed' : null,
          className,
        ].join(' ')}
      >

        <div className="field-wrapper">
          { label !== false && (
            <label
              htmlFor={rest.id}
            >
              { label || placeholder }
            </label>
          )}

          <Tag
            { ...rest }
            ref={(ref) => this.input = ref}
            className="field"
            type={this.getType()}
            disabled={disabled}
            required={required}
            value={value}
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            validate={null}
            placeholder={!dirty ? placeholder : null}
          />
        </div>

        { this.props.error && (
          <span className="error">{ this.props.error }</span>
        ) }
      </div>
    );
  }
}

export default TextField;
