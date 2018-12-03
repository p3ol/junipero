import React from 'react';
import PropTypes from 'prop-types';
import IntlTelInput from 'react-intl-tel-input';

import { injectStyles } from '../utils';
import styles from '../theme/components/PhoneField.styl';

class PhoneField extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool,
    ]),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    boxed: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    validate: PropTypes.func,
    theme: PropTypes.string,
    defaultCountry: PropTypes.string,
    forceDefaultCountry: PropTypes.bool,
    preferredCountries: PropTypes.array,
    onlyCountries: PropTypes.array,
    excludeCountries: PropTypes.array,
    customStyles: PropTypes.object,
  }

  static defaultProps = {
    className: null,
    name: '',
    id: '',
    value: '',
    label: '',
    placeholder: '',
    disabled: false,
    required: false,
    boxed: false,
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
    validate: null,
    theme: 'default',
    defaultCountry: 'fr',
    forceDefaultCountry: false,
    preferredCountries: ['FR', 'GB', 'BE', 'US', 'ES', 'DE'],
    onlyCountries: [],
    excludeCountries: [],
    customStyles: {},
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-phone-field-styles', after: '#junipero-main-styles' });

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

  onChange(isValid, parsedPhone, countryData, phone) {
    let value = phone;
    let valid = this.props.validate ? this.props.validate(value) : isValid;

    this.setState({
      value,
      valid,
      country: countryData?.iso2,
      dirty: true,
    }, () => {
      this.props.onChange({
        value,
        valid,
        country: this.state.country,
      });
    });
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
      onlyCountries,
      forceDefaultCountry,
    } = this.props;

    return (
      <div
        className={[
          'junipero',
          'junipero-field',
          'phone-field',
          'theme-' + theme,
          label !== false && (label || placeholder) ? 'with-label' : null,
          forceDefaultCountry || onlyCountries.length === 1 ? 'forced' : null,
          focused ? 'focused' : null,
          dirty ? 'dirty' : null,
          !valid ? 'invalid' : null,
          disabled ? 'disabled' : null,
          required ? 'required' : null,
          boxed ? 'boxed' : null,
          className,
        ].join(' ')}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
      >
        <div className="field-wrapper">

          <IntlTelInput
            css={['intl-tel-input', 'field']}
            disabled={disabled}
            fieldName={this.props.name}
            fieldId={this.props.id}
            value={value}
            onlyCountries={this.props.onlyCountries}
            preferredCountries={this.props.preferredCountries}
            utilsScript={ 'https://cdnjs.cloudflare.com/ajax/libs/' +
            'intl-tel-input/12.4.0/js/utils.js' }
            onPhoneNumberChange={this.onChange.bind(this)}
            placeholder={!dirty ? placeholder : null}
            allowDropdown={false}
            defaultCountry={this.props.defaultCountry}
            excludeCountries={this.props.excludeCountries}
            defaultValue={this.state.phone}
            formatOnInit={false}
            style={this.props.customStyles}
          />

          { label !== false && (
            <label
              htmlFor={this.props.name}
            >
              { label || placeholder }
            </label>
          )}
        </div>

        { this.props.error && (
          <span className="error">{ this.props.error }</span>
        ) }
      </div>
    );
  }
}

export default PhoneField;
