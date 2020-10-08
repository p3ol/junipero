import React from 'react';
import PropTypes from 'prop-types';

import { inject } from './style';
import { classNames } from './utils';
import styles from './theme/components/RadioField.styl';

export default class RadioField extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.array,
    disabled: PropTypes.bool,
    theme: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    onChange: PropTypes.func,
    parseTitle: PropTypes.func,
    parseValue: PropTypes.func,
  }

  static defaultProps = {
    id: '',
    name: '',
    label: '',
    options: [],
    disabled: false,
    theme: 'default',
    value: '',
    onChange: () => {},
    parseTitle: val => val?.toString(),
    parseValue: val => val,
  }

  state = {
    active: false,
    checked: {},
  }

  constructor (props) {
    super(props);
    inject(styles, 'junipero-radio-field-styles');
  }

  componentDidMount () {
    const { parseValue, options, value } = this.props;
    this.setState({ checked: options?.find(i => parseValue(i) === value) });
  }

  onChange (item, e) {
    e.persist?.();
    const { onChange, parseTitle, parseValue } = this.props;

    if (this.props.disabled) {
      return;
    }

    this.setState({
      checked: item,
    }, () => {
      onChange({
        title: parseTitle(this.state.checked),
        value: parseValue(this.state.checked),
        valid: true,
      });
    });
  }

  isChecked (item) {
    const { parseValue } = this.props;
    return parseValue(this.state.checked) === parseValue(item);
  }

  render () {
    const {
      id,
      name,
      label,
      options,
      theme,
      className,
      disabled,
      parseTitle,
    } = this.props;
    const { checked } = this.state;

    return (
      <div
        className={classNames(
          'junipero',
          'junipero-radio-field',
          'theme-' + theme,
          { disabled },
          className,
        )}
      >
        <p className="label">{label}</p>
        <ul>
          { options.map((item, key) => {
            return (
              <li
                key={key}
                className={classNames({ checked })}
              >
                <label
                  onClick={this.onChange.bind(this, item)}
                  className="radio-wrapper">
                  <input
                    id={id}
                    name={name}
                    type="radio"
                    checked={this.isChecked(item)}
                    readOnly
                  />
                  <div className="check"></div>
                  <div className="item-label">
                    { parseTitle(item) }
                  </div>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

}
