import React from 'react';
import PropTypes from 'prop-types';

import { inject } from './style';
import { omit, exists, classNames } from './utils';
import styles from './theme/components/TextField.styl';

class TextField extends React.Component {

  static propTypes = {
    boxed: PropTypes.bool,
    disabled: PropTypes.bool,
    forceLabel: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool,
    ]),
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    rows: PropTypes.number,
    theme: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    validate: PropTypes.func,
  }

  static defaultProps = {
    boxed: false,
    disabled: false,
    forceLabel: false,
    label: null,
    placeholder: '',
    readOnly: false,
    required: false,
    rows: null,
    theme: 'default',
    type: 'text',
    value: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    validate: value => /.+/g.test(value),
  }

  input = null

  state = {
    dirty: exists(this.props.value) && this.props.value !== '',
    focused: false,
    valid: exists(this.props.valid) ? this.props.valid : true,
    value: exists(this.props.value) ? this.props.value : '',
  };

  constructor(props) {
    super(props);
    inject(styles, 'junipero-text-field-styles');
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.setState({
        value: this.props.value,
        dirty: exists(this.props.value) && this.props.value !== '',
      });
    }
  }

  onFocus(e) {
    const { value } = this.state;

    if (this.props.disabled) {
      return false;
    }

    this.props.onFocus(e);
    if (
      e?.defaultPrevented ||
      e?.isImmediatePropagationStopped?.() ||
      e?.isPropagationStopped?.()
    ) {
      return false;
    }

    this.setState({
      focused: true,
      dirty: exists(value) && value !== '',
    });
    return true;
  }

  onBlur(e) {
    const { value } = this.state;

    if (this.props.disabled) {
      return false;
    }

    this.props.onBlur(e);

    if (
      e?.defaultPrevented ||
      e?.isImmediatePropagationStopped?.() ||
      e?.isPropagationStopped?.()
    ) {
      return false;
    }

    this.setState({
      focused: false,
      dirty: exists(value) && value !== '',
    });

    return true;
  }

  onChange(e) {
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
      value: exists(this.props.value) ? this.props.value : '',
      valid: exists(this.props.valid) ? this.props.valid : true,
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
    return [
      'date', 'number', 'password', 'color', 'email', 'tel',
    ].includes(this.props.type)
      ? this.props.type
      : 'text';
  }

  render() {
    const { focused, value, valid, dirty } = this.state;

    const {
      disabled,
      forceLabel,
      readOnly,
      required,
      boxed,
      className,
      placeholder,
      label,
      theme,
      error,
      ...rest
    } = this.props;

    const Tag = rest.rows > 1 ? 'textarea' : 'input';

    return (
      <div
        className={classNames(
          'junipero',
          'junipero-field',
          'junipero-text-field',
          'theme-' + theme,
          {
            focused,
            dirty,
            disabled,
            required,
            boxed,
            invalid: !valid,
            error,
            'force-label': forceLabel,
            'with-label': label !== false && (label || placeholder),
          },
          className,
        )}
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
            { ...omit(rest, [
              'onChange',
            ]) }
            ref={(ref) => this.input = ref}
            className="field"
            type={this.getType()}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            value={value}
            onFocus={this.onFocus.bind(this)}
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            validate={null}
            placeholder={!dirty ? placeholder : null}
          />
        </div>

        { error && (
          <span className="error">{ error }</span>
        ) }
      </div>
    );
  }
}

export default TextField;
