import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles } from '../utils';
import styles from '../theme/components/Toggle.styl';

class Toggle extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    checked: PropTypes.bool,
    value: PropTypes.string,
    onLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    offLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
      { id: 'junipero-toggle-styles', after: '#junipero-main-styles' });

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

  render() {
    return (
      <div
        className={[
          'junipero',
          'toggle',
          'theme-' + this.props.theme,
          this.state.active ? 'active' : null,
          this.state.checked ? 'checked' : null,
          this.props.disabled ? 'disabled' : null,
          this.props.className,
        ].join(' ')}
      >
        <label
          className="toggle-wrapper"
        >
          <div className="toggle-inner">
            <input
              type="checkbox"
              onChange={this.onChange.bind(this)}
              value={this.props.value}
              disabled={this.props.disabled}
            />
            <div className="toggle">
              <div className="handle" />
            </div>
          </div>

          <div className="label">
            { this.state.checked ? this.props.onLabel : this.props.offLabel }
          </div>

        </label>
      </div>
    );
  }

}

export default Toggle;
