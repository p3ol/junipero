import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles } from '../utils';
import styles from '../theme/components/CodeField.styl';

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
    size: PropTypes.number,
  }

  static defaultProps = {
    className: null,
    value: '',
    disabled: false,
    autofocus: false,
    required: false,
    onChange: () => {},
    validate: null,
    theme: 'default',
    size: 6,
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-code-field-styles', after: '#junipero-main-styles' });

    this.state = {
      focused: false,
      dirty: !!this.props.value,
      values: [],
      valid: this.props.valid || true,
    };

    this.inputs = [];
  }

  componentDidMount() {
    for (let i = 0; i < this.props.size; i++) {
      this.state.values.push(this.props.value[i] || '');
      this.inputs.push(null);
    }
    this.setState({
      inputs: this.state.inputs,
      values: this.state.values,
    }, () => {
      this.autofocus();
    });
  }

  autofocus() {
    if (this.props.autofocus === true) {
      this._focusTimeout = setTimeout(() => {
        this.inputs[0]?.focus();
      }, 1);
    }
  }

  componentWillReceiveProps(next) {
    for (let i = 0; i < next.size; i++) {
      this.state.values.push(next.value[i] || '');
    }
    this.setState({ values: this.state.values });
  }

  onItemChange(key, e) {
    this.state.values[key] = e.target ? e.target.value : e;
    this.setState({
      values: this.state.values,
      valid: this.isValid(this.state.values.join('')),
    }, () => {
      this.props.onChange({
        value: this.state.values.join(''),
        valid: this.state.valid,
      });
    });
    if (this.state.values[key]) {
      this.inputs[key + 1]?.focus();
    }
  }

  onKeyDown(key, e) {
    if (this.props.disabled === true) {
      return;
    }

    let current = this.inputs[key];
    let prev = this.inputs[key - 1];
    let next = this.inputs[key + 1];

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
    return value.length === this.props.size &&
      (this.props.validate ? this.props.validate(value) : true);

  }

  isItemDirty(key) {
    return this.state.values[key] && this.state.values[key] !== '';
  }

  render() {
    const { theme, className, disabled } = this.props;
    const { values, valid } = this.state;

    return (
      <div
        className={[
          'junipero',
          'junipero-field',
          'code-field',
          'theme-' + theme,
          (!valid ? 'invalid' : null),
          className,
        ].join(' ')}
      >
        {this.inputs.map((value, key) => {
          return (
            <input
              className={[
                disabled ? 'disabled' : null,
                (this.isItemDirty(key) ? 'dirty' : null),
              ].join(' ')}
              key={key}
              type="tel"
              value={values[key]}
              size={1}
              maxLength={1}
              disabled={disabled}
              ref={ (ref) => { this.inputs[key] = ref; } }
              onChange={this.onItemChange.bind(this, key)}
              onKeyDown={this.onKeyDown.bind(this, key)}
            />
          );
        })}
      </div>
    );
  }

  componentWillUnmount() {
    clearTimeout(this._focusTimeout);
  }
}

export default CodeField;
