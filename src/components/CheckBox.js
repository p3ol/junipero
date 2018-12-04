import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { injectStyles, omit } from '../utils';
import styles from '../theme/components/CheckBox.styl';

class CheckBox extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    checked: PropTypes.bool,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    theme: PropTypes.string,
  }

  static defaultProps = {
    className: null,
    checked: false,
    value: null,
    disabled: false,
    required: false,
    onChange: () => {},
    theme: 'default',
  }

  state = {
    checked: this.props.checked,
    active: false,
  };

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-check-box-styles', after: '#junipero-main-styles' });
  }

  onChange(e) {
    e.persist();

    if (this.props.disabled) {
      return;
    }

    const checked = e.target.checked;

    this.setState({
      checked,
    }, () => {
      this.props.onChange({
        value: checked ? this.props.value : null,
        checked,
      });
    });
  }

  onMouseDown() {
    if (this.props.disabled) {
      return;
    }

    this.setState({ active: true });
  }

  onMouseUp() {
    if (this.props.disabled) {
      return;
    }

    this.setState({ active: false });
  }

  render() {
    const { theme, className, disabled, children, value, ...rest } = this.props;
    const { active, checked } = this.state;

    return (
      <div
        className={classNames(
          'junipero',
          'junipero-check-box',
          'theme-' + theme,
          {
            active,
            checked,
            disabled,
          },
          className,
        )}
      >
        <label
          className="check-wrapper"
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
        >
          <div className="check-inner">
            <input
              { ...omit(rest, [
                'onChange', 'checked',
              ]) }
              type="checkbox"
              onChange={this.onChange.bind(this)}
              value={value}
              disabled={disabled}
            />
            <div className="check" />
          </div>

          <div className="label">
            { children }
          </div>
        </label>
      </div>
    );
  }

}

export default CheckBox;
