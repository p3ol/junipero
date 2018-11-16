import React from 'react';
import PropTypes from 'prop-types';

import TextField from './TextField';
import { injectStyles, omit } from '../utils';
import styles from '../theme/components/SelectField.styl';

class SelectField extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    boxed: PropTypes.bool,
    native: PropTypes.bool,
    placeholder: PropTypes.string,
    parseValue: PropTypes.func,
    parseTitle: PropTypes.func,
    options: PropTypes.array,
    placement: PropTypes.string,
    onChange: PropTypes.func,
    validate: PropTypes.func,
    autoComplete: PropTypes.func,
    autoCompleteLabel: PropTypes.string,
    autoCompleteThreshold: PropTypes.number,
  }

  static defaultProps = {
    className: '',
    label: null,
    disabled: false,
    required: false,
    boxed: false,
    native: true,
    placeholder: '',
    parseValue: (val) => val,
    parseTitle: (val) => val,
    options: [],
    placement: 'bottom',
    onChange: () => {},
    validate: value => !!value,
    autoComplete: null,
    autoCompletePlaceholder: 'Search...',
    autoCompleteThreshold: 400,
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-select-field-styles', after: '#junipero-main-styles' });

    this.state = {
      value: null,
      valid: true,
      opened: this.props.opened || false,
      autoCompleteValue: '',
      autoCompleteOptions: null,
      autoCompleting: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside.bind(this), true);
    this.onPropValueChange();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.onPropValueChange();
    }

    if (prevProps.disabled !== this.props.disabled && !this.props.disabled) {
      this.setState({
        opened: false,
      }, () => {
        this.resetAutoComplete();
      });
    }
  }

  onToggle(e) {
    e.preventDefault();

    if (this.props.disabled) {
      return;
    }

    const opened = !this.state.opened;

    this.setState({
      opened,
    }, () => {
      this.resetAutoComplete();
      this.autoCompleteInput?.focus();
    });
  }

  onClickOutside(e) {
    if (this.toggle && this.toggle === e.target) {
      return;
    }

    if (this.container && !this.container.contains(e.target)) {
      this.setState({ opened: false });
      this.resetAutoComplete();
    }
  }

  onPropValueChange() {
    const { native, options, value, parseValue, autoComplete } = this.props;

    const index = value === undefined || value === null ?
      -1 :
      options.findIndex((item) =>
        parseValue(item) === parseValue(value)
      );

    if (native && !autoComplete) {
      this.onNativeChange(index);
    } else {
      this.onChange(options[index]);
    }
  }

  onChange(item, e) {
    e?.preventDefault();

    const { parseValue, validate, disabled } = this.props;

    if (disabled) {
      return;
    }

    const value = item ? parseValue(item) : null;
    const valid = validate(value);

    this.setState({
      value,
      valid,
      opened: false,
    }, () => {
      this.props.onChange({
        value,
        valid,
      });
    });
  }

  onNativeChange(e) {
    const { validate, parseValue, options, disabled } = this.props;

    if (disabled) {
      return;
    }

    const option = options[e?.target?.value || e];
    const value = option ? parseValue(option) : null;
    const valid = validate(value);

    this.setState({
      value: e?.target?.value || e,
      valid,
    }, () => {
      this.props.onChange({
        value,
        valid,
      });
    });
  }

  reset() {
    this.resetAutoComplete();
    this.onPropValueChange();
  }

  resetAutoComplete() {
    this.setState({
      autoCompleteValue: '',
      autoCompleteOptions: null,
    });
  }

  onAutoCompleteChange(input) {
    clearTimeout(this._autoCompleteTimeout);

    if (!this.props.autoComplete) {
      return;
    }

    this.setState({
      autoCompleting: true,
    }, () => {
      this._autoCompleteTimeout = setTimeout(() => {
        if (!input.value || input.value === '') {
          this.setState({
            autoCompleteValue: input.value,
            autoCompleteOptions: null,
            autoCompleting: false,
          });
        } else {
          this.props.autoComplete(input.value, (items) => {
            this.setState({
              autoCompleteValue: input.value,
              autoCompleteOptions: items || [],
              autoCompleting: false,
            });
          });
        }
      }, this.props.autoCompleteThreshold);
    });
  }

  getValue() {
    const { parseValue } = this.props;
    const { value } = this.state;

    return parseValue && value !== undefined && value !== null ?
      parseValue(value) :
      value;
  }

  getTitle() {
    const { parseTitle, parseValue, placeholder } = this.props;
    const { value } = this.state;

    const result = (
      parseTitle && value !== undefined && value !== null ?
        parseTitle(value) :
        parseValue && value !== undefined && value !== null ?
          parseValue(value) :
          placeholder
    )?.toString();

    return result;
  }

  render() {
    const {
      disabled,
      required,
      valid,
      boxed,
      placement,
      className,
      native,
      autoComplete,
      placeholder,
      label,
      options,
      autoCompletePlaceholder,
      parseTitle,
      id,
      error,
      ...rest
    } = this.props;

    const {
      opened,
      value,
      autoCompleting,
      autoCompleteOptions,
      autoCompleteValue,
    } = this.state;

    const listOptions = autoCompleteOptions || options;

    return (
      <div
        ref={(ref) => this.container = ref}
        className={[
          'junipero',
          'junipero-field',
          'select-field',
          disabled ? 'disabled' : null,
          opened ? 'opened' : null,
          required ? 'required' : null,
          label ? 'with-label' : null,
          !valid ? 'invalid' : null,
          boxed ? 'boxed' : null,
          `placement-${placement || 'bottom'}`,
          className,
        ].join(' ')}
      >
        <div className="field-wrapper">

          { label && (
            <label htmlFor={id}>{ label }</label>
          )}

          { native && !autoComplete ? (
            <select
              { ...omit(rest, [
                'validate', 'parseValue', 'autoCompleteThreshold',
              ]) }
              id={id}
              ref={(ref) => this.nativeField = ref}
              className="field"
              value={`${value}`}
              disabled={disabled}
              onChange={this.onNativeChange.bind(this)}
            >
              <option value="-1">{ placeholder }</option>
              { options.map((item, index) => (
                <option
                  key={index}
                  value={index}
                >
                  { parseTitle(item)?.toString() }
                </option>
              ))}
            </select>
          ) : (
            <a
              href="#"
              className="field"
              ref={(ref) => this.toggle = ref}
              onClick={this.onToggle.bind(this)}
            >
              { this.getTitle() }
            </a>
          )}

          { (!native || autoComplete) && (
            <ul
              className={[
                'select-menu',
                `placement-${placement || 'bottom'}`,
                autoCompleting ? 'auto-completing' : null,
              ].join(' ')}
            >
              { autoComplete && (
                <li className="select-auto-complete">
                  <TextField
                    ref={(ref) => this.autoCompleteInput = ref}
                    label={null}
                    placeholder={autoCompletePlaceholder}
                    value={autoCompleteValue}
                    onChange={this.onAutoCompleteChange.bind(this)}
                  />
                </li>
              )}

              { listOptions.map((item, index) => (
                <li
                  className="select-menu-item"
                  key={index}
                >
                  <a
                    href="#"
                    onClick={this.onChange.bind(this, item)}
                  >
                    { parseTitle(item)?.toString() }
                  </a>
                </li>
              ))}
            </ul>
          )}

        </div>

        { error && (
          <span className="error">{ this.props.error }</span>
        ) }
      </div>
    );
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside.bind(this), true);
  }

}

export default SelectField;
