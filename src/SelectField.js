import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from './Dropdown';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import DropdownItem from './DropdownItem';
import TextField from './TextField';
import { injectStyles, omit, classNames } from './utils';
import styles from './theme/components/SelectField.styl';

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
    onChange: PropTypes.func,
    validate: PropTypes.func,
    autoComplete: PropTypes.func,
    autoCompleteLabel: PropTypes.string,
    autoCompleteThreshold: PropTypes.number,
    theme: PropTypes.string,
    animateMenu: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    label: null,
    disabled: false,
    required: false,
    boxed: false,
    native: false,
    placeholder: '',
    parseValue: (val) => val,
    parseTitle: (val) => val,
    options: [],
    onChange: () => {},
    validate: value => typeof value !== undefined && value !== null,
    autoComplete: null,
    autoCompletePlaceholder: 'Search...',
    autoCompleteThreshold: 400,
    theme: 'default',
    animateMenu: menu => menu,
  }

  state = {
    value: null,
    valid: true,
    opened: this.props.opened || false,
    autoCompleteValue: '',
    autoCompleteOptions: null,
    autoCompleting: false,
  };

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-select-field-styles', after: '#junipero-main-styles' });
  }

  componentDidMount() {
    this.onPropValueChange(false);
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

  onToggle(opened) {
    if (this.props.disabled) {
      return;
    }

    this.setState({
      opened,
    }, () => {
      this.resetAutoComplete();
      this.autoCompleteInput?.focus();
    });
  }

  onPropValueChange(propagateChange = true) {
    const { native, options, value, parseValue, autoComplete } = this.props;

    const index = value === undefined || value === null
      ? -1
      : options.findIndex((item) =>
        parseValue(item) === value
      );

    if (native && !autoComplete) {
      this.onNativeChange(null, index);
    } else {
      this.onChange(options[index], null, propagateChange);
    }
  }

  onChange(item, e, propagateChange = true) {
    e?.preventDefault();

    const { parseValue, validate, disabled } = this.props;

    if (disabled) {
      return;
    }

    const valid = validate(item ? parseValue(item) : item);

    this.setState({
      value: item,
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
    const { validate, parseValue, options, disabled } = this.props;

    if (disabled) {
      return;
    }

    const index = typeof forceIndex !== 'undefined' && forceIndex !== null
      ? forceIndex
      : e?.target?.value;

    const option = options[index];
    const value = option ? parseValue(option) : null;
    const valid = validate(value);

    this.setState({
      value: index,
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
          }, () => this.menuRef?.updatePopper());
        } else {
          this.props.autoComplete(input.value, (items) => {
            this.setState({
              autoCompleteValue: input.value,
              autoCompleteOptions: items || [],
              autoCompleting: false,
            }, () => this.menuRef?.updatePopper());
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
      parseTitle && typeof value !== 'undefined' && value !== null
        ? parseTitle(value)
        : parseValue && typeof value !== 'undefined' && value !== null
          ? parseValue(value)
          : placeholder
    )?.toString();

    return result;
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
        className={classNames(
          'junipero',
          'junipero-field',
          'junipero-select-field',
          'theme-' + theme,
          {
            disabled,
            opened,
            required,
            boxed,
            'with-label': label,
            invalid: !valid,
          },
          className,
        )}
      >
        <div className="field-wrapper">

          { label && (
            <label htmlFor={id}>{ label }</label>
          )}

          { native && !autoComplete ? (
            <select
              { ...omit(rest, [
                'validate', 'parseValue', 'autoCompleteThreshold', 'placement',
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
            <Dropdown
              { ...omit(rest, [
                'validate', 'parseValue', 'autoCompleteThreshold', 'onChange',
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
                innerRef={(ref) => this.menuRef = ref}
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

                { listOptions.map((item, index) => (
                  <DropdownItem
                    key={index}
                  >
                    <a
                      href="#"
                      onClick={this.onChange.bind(this, item)}
                    >
                      { parseTitle(item)?.toString() }
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
