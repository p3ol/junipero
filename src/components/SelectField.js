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
    this.setState({
      opened: !this.state.opened,
    });
  }

  onChange(option) {
    const { forceValue, valueKey, validate } = this.props;
    const value = forceValue ? option[valueKey] : option;
    const valid = validate(value);

    this.setState({
      value: option,
      valid,
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
        className={[
          'udf',
          'select-field',
          this.state.value ? 'dirty' : null,
          this.props.disabled ? 'disabled' : null,
          this.props.opened ? 'opened' : null,
          !this.props.valid ? 'invalid' : null,
          this.props.boxed ? 'boxed' : null,
          this.props.className,
        ].join(' ')}
      >
        <div className="select-wrapper">
          { this.props.prefix && (
            <div className="select-prefix">{ this.props.prefix }</div>
          ) }

          <div className="select-inner">
            <a
              className="select-toggle"
              onClick={this.onToggle.bind(this)}
              role="button"
              tabIndex={this.props.tabIndex}
            >
              { this.getCurrentTitle() }
            </a>

            <ul className="select-menu">
              { this.props.options.map((item, index) => (
                <li className="select-menu-item" key={index}>
                  <a
                    onClick={this.onChange.bind(this, item)}
                    role="button"
                    tabIndex={ this.props.tabIndex + index + 1 }
                  >
                    { this.getOptionTitle(item) }
                  </a>
                </li>
              ))}
            </ul>
          </div>

          { this.props.suffix && (
            <div className="select-suffix">{ this.props.suffix }</div>
          ) }
        </div>

        { this.props.error && (
          <span className="error">{ this.props.error }</span>
        ) }
      </div>
    );
  }

}

SelectField.propTypes = propTypes;
SelectField.defaultProps = defaultProps;

export default SelectField;
