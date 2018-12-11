import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles, omit, classNames } from './utils';
import styles from './theme/components/CodeField.styl';

class CodeField extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    autofocus: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    validate: PropTypes.func,
    theme: PropTypes.string,
    boxed: PropTypes.bool,
    size: PropTypes.number,
  }

  static defaultProps = {
    className: null,
    value: '',
    disabled: false,
    autofocus: false,
    required: false,
    onChange: () => {},
    validate: val => true,
    theme: 'default',
    boxed: false,
    size: 6,
  }

  state = {
    focused: false,
    dirty: !!this.props.value,
    values: Array.from({ length: this.props.size }, (item, index) => (
      this.props.value?.[index] || ''
    )),
    valid: this.props.valid || true,
  };

  inputs = [];

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-code-field-styles', after: '#junipero-main-styles' });
  }

  componentDidMount() {
    if (this.props.autofocus) {
      this.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.state.values = this.state.values.map((item, index) => (
        this.props.value?.[index] || ''
      ));

      this.setState({
        values: this.state.values,
      });
    }
  }

  focus(index = 0) {
    clearTimeout(this._focusTimeout);
    this._focusTimeout = setTimeout(() => {
      this.inputs[index]?.focus();
    }, 1);
  }

  onItemChange(index, e) {
    const { onChange } = this.props;
    const { values } = this.state;

    values[index] = typeof e === 'string' ? e : e.target?.value || '';

    this.setState({
      values,
      valid: this.isValid(values.join('')),
    }, () => {
      onChange({
        value: values.join(''),
        valid: this.state.valid,
      });
    });

    if (values[index]) {
      this.focus(index + 1);
    }
  }

  onKeyDown(key, e) {
    e.persist();

    if (this.props.disabled) {
      return;
    }

    const current = this.inputs[key];
    const prev = this.inputs[key - 1];
    const next = this.inputs[key + 1];

    if (e.keyCode === 8 || e.key === 'Backspace') {
      if (current.selectionStart !== current.selectionEnd ||
          current.selectionStart === 1) {
        return;
      }

      this.onItemChange(key - 1, '');
      prev?.focus();
      return;
    }

    if (e.keyCode === 37 || e.key === 'ArrowLeft') {
      if (current.selectionStart != current.selectionEnd || key === 0) {
        return;
      }
      prev.selectionStart = current.selectionStart;
      prev.selectionEnd = current.selectionStart;
      prev.focus();
      e.preventDefault();
      return;
    }

    if (e.keyCode === 39 || e.key === 'ArrowRight') {
      if (current.selectionStart != current.selectionEnd ||
          key === this.props.size - 1) {
        return;
      }
      next.selectionStart = current.selectionStart;
      next.selectionEnd = current.selectionStart;
      next.focus();
      e.preventDefault();
      return;
    }
  }

  isValid(value) {
    const { size, validate } = this.props;
    return value.length === size && validate(value);
  }

  isDirty(index) {
    return this.state.values[index];
  }

  render() {
    const { theme, className, disabled, size, boxed, ...rest } = this.props;
    const { values, valid } = this.state;

    return (
      <div
        { ...omit(rest, [
          'autofocus', 'validate', 'onChange',
        ]) }
        className={classNames(
          'junipero',
          'junipero-field',
          'junipero-code-field',
          'theme-' + theme,
          {
            boxed,
            invalid: !valid,
          },
          className,
        )}
      >
        { Array.from({ length: size }).map((item, index) => (
          <input
            className={classNames({
              disabled,
              dirty: this.isDirty(index),
            })}
            key={index}
            type="tel"
            value={values[index]}
            size={1}
            maxLength={1}
            disabled={disabled}
            ref={(ref) => this.inputs[index] = ref}
            onChange={this.onItemChange.bind(this, index)}
            onKeyDown={this.onKeyDown.bind(this, index)}
          />
        ))}
      </div>
    );
  }

  componentWillUnmount() {
    clearTimeout(this._focusTimeout);
  }
}

export default CodeField;
