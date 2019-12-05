import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from './Dropdown';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import DropdownItem from './DropdownItem';
import TextField from './TextField';
import { inject } from './style';
import { omit, classNames } from './utils';
import styles from './theme/components/SelectField.styl';

class SelectField extends React.Component {

  static propTypes = {
    acceptAnyOption: PropTypes.bool,
    autoCompletePlaceholder: PropTypes.string,
    autoCompleteThreshold: PropTypes.number,
    boxed: PropTypes.bool,
    compareRawValueOnChange: PropTypes.bool,
    disabled: PropTypes.bool,
    emptyText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    forceLabel: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool,
    ]),
    native: PropTypes.bool,
    options: PropTypes.array,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    theme: PropTypes.string,
    animateMenu: PropTypes.func,
    autoComplete: PropTypes.func,
    onChange: PropTypes.func,
    onToggle: PropTypes.func,
    parseTitle: PropTypes.func,
    parseValue: PropTypes.func,
    validate: PropTypes.func,
  }

  static defaultProps = {
    acceptAnyOption: false,
    autoCompletePlaceholder: 'Search...',
    autoCompleteThreshold: 400,
    boxed: false,
    compareRawValueOnChange: false,
    disabled: false,
    emptyText: null,
    forceLabel: false,
    label: null,
    native: false,
    options: [],
    placeholder: '',
    required: false,
    theme: 'default',
    autoComplete: null,
    onChange: () => {},
    onToggle: () => {},
    parseTitle: (val) => val?.toString(),
    parseValue: (val) => val,
    validate: value => typeof value !== 'undefined' && value !== null,
  }

  state = {
    autoCompleteOptions: null,
    autoCompleteValue: '',
    autoCompleting: false,
    opened: this.props.opened || false,
    valid: true,
    value: null,
    dirty: false,
    unknownOptions: [],
  };

  constructor(props) {
    super(props);
    inject(styles, 'junipero-select-field-styles');
  }

  componentDidMount() {
    this.onPropValueChange(false);
  }

  componentDidUpdate(prevProps) {
    const { parseValue, compareRawValueOnChange } = this.props;

    if (
      (compareRawValueOnChange && prevProps.value !== this.props.value) ||
      parseValue(prevProps.value) !== parseValue(this.props.value)
    ) {
      this.onPropValueChange();
    }

    if (prevProps.options !== this.props.options) {
      this.onPropValueChange(false);
    }

    if (prevProps.disabled !== this.props.disabled && this.props.disabled) {
      this.setState({
        opened: false,
      }, () => {
        this.resetAutoComplete();
      });
    }
  }

  onToggle(opened) {
    if (this.props.disabled) {
      return;
    }

    this.setState({
      opened,
    }, () => {
      this.resetAutoComplete();
      this.autoCompleteInput?.focus();
      this.props.onToggle(opened);
    });
  }

  getIndex(value) {
    const { options, parseValue } = this.props;
    const { unknownOptions } = this.state;

    const mergedOptions = [...unknownOptions, ...options];
    return mergedOptions.findIndex(item => parseValue(item) === value ||
      parseValue(item) === parseValue(value));
  }

  onPropValueChange(propagateChange = true) {
    const {
      native,
      options,
      value,
      autoComplete,
      acceptAnyOption,
    } = this.props;

    if (value && acceptAnyOption && this.getIndex(value) === -1) {
      this.state.unknownOptions = [value];
      this.setState({ unknownOptions: [value] });
    }

    const mergedOptions = [...this.state.unknownOptions, ...options];
    const index = typeof value === 'undefined' || value === null
      ? -1
      : this.getIndex(value);

    if (native && !autoComplete) {
      this.onNativeChange(null, index, propagateChange);
    } else {
      this.onChange(mergedOptions[index], null, propagateChange);
    }
  }

  onChange(item, e, propagateChange = true) {
    e?.preventDefault();

    const { parseValue, validate, disabled } = this.props;

    if (disabled && propagateChange) {
      return;
    }

    const valid = validate(item ? parseValue(item) : item);

    this.setState({
      value: item,
      dirty: !!item,
      valid,
      opened: false,
    }, () => {
      if (propagateChange) {
        this.props.onChange({
          value: item ? parseValue(item) : item,
          valid,
        });
      }
    });
  }

  onNativeChange(e, forceIndex, propagateChange = true) {
    const {
      validate,
      parseValue,
      options,
      disabled,
    } = this.props;
    const { unknownOptions } = this.state;

    if (disabled && propagateChange) {
      return;
    }

    const mergedOptions = [...unknownOptions, ...options];
    const index = typeof forceIndex !== 'undefined' && forceIndex !== null
      ? forceIndex
      : parseInt(e?.target?.value, 10);

    const option = mergedOptions[index];

    const value = option ? parseValue(option) : null;
    const valid = validate(value);

    this.setState({
      value: option,
      dirty: !!value,
      valid,
    }, () => {
      if (propagateChange) {
        this.props.onChange({
          value,
          valid,
        });
      }
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
    const { autoComplete, autoCompleteThreshold } = this.props;
    clearTimeout(this._autoCompleteTimeout);

    this.setState({
      autoCompleting: true,
    }, () => {
      this._autoCompleteTimeout = setTimeout(() => {
        if (!input.value || input.value === '') {
          this.setState({
            autoCompleteValue: input.value,
            autoCompleteOptions: null,
            autoCompleting: false,
          }, () => this.menuRef?.updatePopper());
        } else {
          autoComplete?.(input.value, (items) => {
            this.setState({
              autoCompleteValue: input.value,
              autoCompleteOptions: [].concat(items),
              autoCompleting: false,
            }, () => this.menuRef?.updatePopper());
          });
        }
      }, autoCompleteThreshold);
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
    const { parseTitle, placeholder } = this.props;
    const { value } = this.state;

    return typeof value !== 'undefined' && value !== null
      ? parseTitle(value)
      : placeholder;
  }

  getNativeIndex() {
    const { options, parseValue } = this.props;
    const { unknownOptions } = this.state;
    const value = this.getValue();
    const mergedOptions = [...unknownOptions, ...options];

    return mergedOptions?.findIndex((item) => parseValue(item) === value);
  }

  open() {
    this.onToggle(true);
  }

  close() {
    this.onToggle(false);
  }

  render() {
    const {
      disabled,
      required,
      valid,
      boxed,
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
      theme,
      animateMenu,
      forceLabel,
      emptyText,
      ...rest
    } = this.props;

    const {
      opened,
      dirty,
      autoCompleting,
      autoCompleteOptions,
      autoCompleteValue,
      unknownOptions,
    } = this.state;

    const mergedOptions = [...unknownOptions, ...options];
    const listOptions = autoCompleteOptions || mergedOptions;

    return (
      <div
        ref={ref => this.container = ref}
        className={classNames(
          'junipero',
          'junipero-field',
          'junipero-select-field',
          'theme-' + theme,
          {
            disabled,
            opened,
            required,
            dirty,
            boxed,
            'has-error': error,
            'force-label': forceLabel,
            'with-label': label !== false && (label || placeholder),
            invalid: !valid,
          },
          className,
        )}
      >
        <div className="field-wrapper">
          { label !== false && (
            <label htmlFor={id}>
              { label || placeholder }
            </label>
          )}

          { native && !autoComplete ? (
            <select
              { ...omit(rest, [
                'validate', 'parseValue', 'autoCompleteThreshold', 'placement',
                'acceptAnyOption', 'compareRawValueOnChange',
              ]) }
              id={id}
              ref={ref => this.nativeField = ref}
              className="field"
              value={this.getNativeIndex()}
              disabled={disabled}
              onChange={this.onNativeChange.bind(this)}
            >
              { placeholder && (
                <option value="-1">{ placeholder }</option>
              ) }

              { !mergedOptions.length && emptyText && (
                <option disabled>{ emptyText }</option>
              )}

              { mergedOptions.map((item, index) => (
                <option key={index} value={index}>{ parseTitle(item) }</option>
              ))}
            </select>
          ) : (
            <Dropdown
              { ...omit(rest, [
                'validate', 'parseValue', 'autoCompleteThreshold', 'onChange',
                'acceptAnyOption', 'compareRawValueOnChange',
              ]) }
              isOpen={opened}
              theme={theme}
              onToggle={this.onToggle.bind(this)}
            >
              <DropdownToggle
                tag="a"
                className="field"
              >
                { this.getTitle() }
              </DropdownToggle>
              <DropdownMenu
                ref={ref => this.menuRef = ref}
                className={classNames({
                  'auto-completing': autoCompleting,
                })}
                animate={animateMenu}
              >
                { autoComplete && (
                  <li className="auto-complete">
                    <TextField
                      theme={theme}
                      ref={(ref) => this.autoCompleteInput = ref}
                      label={false}
                      placeholder={autoCompletePlaceholder}
                      value={autoCompleteValue}
                      onChange={this.onAutoCompleteChange.bind(this)}
                    />
                  </li>
                )}

                { (!listOptions || listOptions.length === 0) && emptyText && (
                  <p className="empty">{ emptyText }</p>
                )}

                { listOptions.map((item, index) => (
                  <DropdownItem
                    key={index}
                  >
                    <a
                      href="#"
                      onClick={this.onChange.bind(this, item)}
                    >
                      { parseTitle(item) }
                    </a>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}

        </div>

        { error && (
          <span className="error">{ this.props.error }</span>
        ) }
      </div>
    );
  }

}

export default SelectField;
