import React from 'react';
import PropTypes from 'prop-types';

import { inject } from './style';
import { omit, classNames } from './utils';
import styles from './theme/components/TextField.styl';

class TextField extends React.Component {

  static propTypes = {
    boxed: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool,
    ]),
    placeholder: PropTypes.string,
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
    label: '',
    placeholder: '',
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
    dirty: !!this.props.value,
    focused: false,
    valid: this.props.valid || true,
    value: this.props.value || '',
  };

  constructor(props) {
    super(props);
    inject(styles, 'junipero-text-field-styles');
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
    return ['date', 'number', 'password', 'color'].includes(this.props.type)
      ? this.props.type
      : 'text';
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
