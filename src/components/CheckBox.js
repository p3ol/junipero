import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles } from '../utils';
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

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-check-box-styles', after: '#junipero-main-styles' });

    this.state = {
      checked: this.props.checked,
      active: false,
    };
  }

  onChange(e) {
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
    return (
      <div
        className={[
          'junipero',
          'check-box',
          'theme-' + this.props.theme,
          this.state.active ? 'active' : null,
          this.state.checked ? 'checked' : null,
          this.props.disabled ? 'disabled' : null,
          this.props.className,
        ].join(' ')}
      >
        <label
          className="check-wrapper"
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
        >
          <div className="check-inner">
            <input
              type="checkbox"
              onChange={this.onChange.bind(this)}
              value={this.props.value}
              disabled={this.props.disabled}
            />
            <div className="check" />
          </div>

          <div className="label">
            { this.props.children }
          </div>
        </label>
      </div>
    );
  }

}

export default CheckBox;
