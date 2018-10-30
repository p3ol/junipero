import React from 'react';
import PropTypes from 'prop-types';

import TextField from './TextField';

import '../theme/components/SelectField.styl';

const propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  boxed: PropTypes.bool,
  emptyComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  arrowComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  forceValue: PropTypes.bool,
  titleKey: PropTypes.string,
  valueKey: PropTypes.string,
  options: PropTypes.array,
  placement: PropTypes.string,
  tabIndex: PropTypes.number,
  onChange: PropTypes.func,
  validate: PropTypes.func,
  prefix: PropTypes.object,
  suffix: PropTypes.object,
  autoComplete: PropTypes.func,
  autoCompleteLabel: PropTypes.string,
  autoCompleteThreshold: PropTypes.number,
};

const defaultProps = {
  className: '',
  label: '',
  disabled: false,
  required: false,
  boxed: false,
  value: null,
  emptyComponent: null,
  arrowComponent: (<i className="select-arrow-icon" />),
  forceValue: false,
  titleKey: 'title',
  valueKey: 'value',
  options: [],
  placement: 'bottom',
  tabIndex: 0,
  onChange: () => {},
  validate: value => !!value,
  prefix: null,
  suffix: null,
  autoComplete: null,
  autoCompleteLabel: 'Search...',
  autoCompleteThreshold: 400,
};

class SelectField extends React.Component {

  constructor(props) {
    super(props);

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
    this.setState({ value: this.getPropValue() });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.onChange(this.props.value);
    }

    if (prevProps.disabled !== this.props.disabled && !this.props.disabled) {
      this.setState({
        opened: false,
      }, () => {
        this.resetAutoComplete();
      });
    }
  }

  getPropValue() {
    const { value, forceValue, valueKey, options } = this.props;

    return forceValue ?
      value :
      options.filter((item) => item === value || item[valueKey] === value)[0];
  }

  getCurrentTitle() {
    const { value } = this.state;
    const { emptyComponent, titleKey } = this.props;

    return (value && value[titleKey] || value) || emptyComponent;
  }

  getOptionTitle(option) {
    return option[this.props.titleKey] || option;
  }

  onToggle() {
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

  onOptionClick(option) {
    if (this.state.autoCompleting) {
      return;
    }

    this.setState({ opened: false });
    this.resetAutoComplete();
    this.onChange(option);
  }

  onChange(option, name, field) {
    if (this.props.disabled || !option) {
      return;
    }

    const { forceValue, valueKey, validate } = this.props;
    const value = forceValue ? option[valueKey] : option;
    const valid = validate(value);

    this.setState({
      value: option,
      valid,
      opened: false,
    }, () => {
      this.resetAutoComplete();
      this.props.onChange({
        value,
        valid,
      });
    });
  }

  reset() {
    this.resetAutoComplete();

    this.setState({
      value: this.props.value || '',
      valid: this.props.valid || true,
    }, () => {
      this.props.onChange({});
    });
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

  render() {
    const listOptions = this.state.autoCompleteOptions ||
      this.props.options;

    return (
      <div
        ref={(ref) => this.container = ref}
        className={[
          'junipero',
          'junipero-field',
          'select-field',
          this.props.disabled ? 'disabled' : null,
          this.state.opened ? 'opened' : null,
          this.props.required ? 'required' : null,
          !this.props.valid ? 'invalid' : null,
          this.props.boxed ? 'boxed' : null,
          `placement-${this.props.placement || 'bottom'}`,
          this.props.className,
        ].join(' ')}
      >
        <a
          ref={(ref) => this.toggle = ref}
          className="field-wrapper"
          onClick={this.onToggle.bind(this)}
          role="button"
          tabIndex={this.props.tabIndex}
        >
          { this.props.prefix && (
            <div className="field-prefix">{ this.props.prefix }</div>
          ) }

          <div className="field-inner">
            <div className="field">
              { this.getCurrentTitle() }
            </div>

            { this.props.label && (
              <span className="label">{ this.props.label }</span>
            ) }
          </div>

          { this.props.arrowComponent && (
            <div className="select-arrow">
              { this.props.arrowComponent }
            </div>
          ) }

          { this.props.suffix && (
            <div className="field-suffix">{ this.props.suffix }</div>
          ) }
        </a>

        { this.props.error && (
          <span className="error">{ this.props.error }</span>
        ) }

        <ul
          className={[
            'select-menu',
            `placement-${this.props.placement || 'bottom'}`,
            this.state.autoCompleting ? 'auto-completing' : null,
          ].join(' ')}
        >
          {this.props.autoComplete && (
            <li className="select-auto-complete">
              <TextField
                ref={(ref) => this.autoCompleteInput = ref}
                label={this.props.autoCompleteLabel}
                value={this.state.autoCompleteValue}
                dirty={false}
                onChange={this.onAutoCompleteChange.bind(this)}
              />
            </li>
          )}

          { listOptions.map((item, index) => (
            <li className="select-menu-item" key={index}>
              <a
                onClick={this.onOptionClick.bind(this, item)}
                role="button"
                tabIndex={ this.props.tabIndex + index + 1 }
              >
                { this.getOptionTitle(item) }
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside.bind(this), true);
  }

}

SelectField.propTypes = propTypes;
SelectField.defaultProps = defaultProps;

export default SelectField;
