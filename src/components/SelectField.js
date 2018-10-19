import React from 'react';
import PropTypes from 'prop-types';

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
};

class SelectField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: null,
      valid: true,
      opened: this.props.opened || false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside.bind(this), true);
    this.setState({ value: this.getPropValue() });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.onChange(this.getPropValue());
    }
  }

  getPropValue() {
    const { value, forceValue, valueKey, options } = this.props;

    return forceValue ?
      value :
      options.filter((item) => item[valueKey] === value)[0];
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

    this.setState({
      opened: !this.state.opened,
    });
  }

  onClickOutside(e) {
    if (this.toggle && this.toggle === e.target) {
      return;
    }

    if (this.container && !this.container.contains(e.target)) {
      this.setState({ opened: false });
    }
  }

  onOptionClick(option) {
    this.setState({ opened: false });
    this.onChange(option);
  }

  onChange(option) {
    if (this.props.disabled) {
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
      this.props.onChange({
        value,
        valid,
      });
    });
  }

  reset() {
    this.setState({
      value: this.props.value || '',
      valid: this.props.valid || true,
    }, () => {
      this.props.onChange({});
    });
  }

  render() {
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
          ].join(' ')}
        >
          { this.props.options.map((item, index) => (
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
