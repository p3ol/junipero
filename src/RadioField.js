import React from 'react';
import PropTypes from 'prop-types';

import { inject } from './style';
import { classNames } from './utils';
import styles from './theme/components/RadioField.styl';

export default class RadioField extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.array,
    disabled: PropTypes.bool,
    theme: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    parseTitle: PropTypes.func,
    parseValue: PropTypes.func,
  }

  static defaultProps = {
    id: '',
    name: '',
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
    const { onChange, parseTitle, parseValue, options, value } = this.props;

    this.setState({
      checked: options?.find(i => parseValue(i) === value) || options[0],
    }, () => {
      onChange({
        title: parseTitle(this.state.checked),
        value: parseValue(this.state.checked),
      });
    });
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
                  <div className="label">
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
