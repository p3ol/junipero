import React from 'react';
import PropTypes from 'prop-types';

import { inject } from './style';
import { omit, classNames } from './utils';
import styles from './theme/components/CodeField.styl';

export default class CodeField extends React.Component {

  static propTypes = {
    autofocus: PropTypes.bool,
    boxed: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    size: PropTypes.number,
    theme: PropTypes.string,
    valid: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
    validate: PropTypes.func,
  }

  static defaultProps = {
    autofocus: false,
    boxed: false,
    disabled: false,
    required: false,
    size: 6,
    theme: 'default',
    value: null,
    valid: true,
    onChange: () => {},
    validate: value => typeof value !== 'undefined' && value !== null,
  }

  state = {
    focused: false,
    valid: this.props.valid ?? true,
    values: Array.from({ length: this.props.size }, (item, index) => (
      this.props.value?.[index] || ''
    )),
  };

  inputs = [];

  constructor (props) {
    super(props);
    inject(styles, 'junipero-code-field-styles');
  }

  componentDidMount () {
    if (this.props.autofocus) {
      this.focus();
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.value !== prevProps.value) {
      this.state.values = this.state.values.map((item, index) => (
        this.props.value?.[index] || ''
      ));

      this.setState({
        values: this.state.values,
      });
    }
  }

  focus (index = 0) {
    this.inputs[index]?.focus();
  }

  onItemChange (index, e) {
    const { onChange } = this.props;
    const { values } = this.state;

    if (this.props.disabled) {
      return;
    }

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

  onKeyDown (key, e) {
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
      if (current.selectionStart !== current.selectionEnd || key === 0) {
        return;
      }

      prev.selectionStart = current.selectionStart;
      prev.selectionEnd = current.selectionStart;
      prev.focus();
      e.preventDefault();
      return;
    }

    if (e.keyCode === 39 || e.key === 'ArrowRight') {
      if (current.selectionStart !== current.selectionEnd ||
          key === this.props.size - 1) {
        return;
      }

      next.selectionStart = current.selectionStart;
      next.selectionEnd = current.selectionStart;
      next.focus();
      e.preventDefault();
    }
  }

  isValid (value) {
    const { size, validate } = this.props;
    return value.length === size && validate(value);
  }

  isDirty (index) {
    return this.state.values[index];
  }

  render () {
    const {
      theme,
      className,
      disabled,
      size,
      boxed,
      ...rest
    } = this.props;
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
        <div className="field-wrapper">
          { Array.from({ length: size }).map((item, index) => (
            <input
              className={classNames(
                {
                  disabled,
                  dirty: this.isDirty(index),
                },
              )}
              key={index}
              type="tel"
              value={values[index]}
              size={1}
              maxLength={1}
              disabled={disabled}
              ref={ref => { this.inputs[index] = ref; }}
              onChange={this.onItemChange.bind(this, index)}
              onKeyDown={this.onKeyDown.bind(this, index)}
            />
          ))}
        </div>
      </div>
    );
  }

}
