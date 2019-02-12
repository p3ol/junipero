import React from 'react';
import PropTypes from 'prop-types';

import { inject } from './style';
import { omit, classNames } from './utils';
import styles from './theme/components/Toggle.styl';

class Toggle extends React.Component {

  static propTypes = {
    checked: PropTypes.bool,
    checkedLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    theme: PropTypes.string,
    uncheckedLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    value: PropTypes.string,
    animateLabel: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
    checkedLabel: 'Enabled',
    disabled: false,
    required: false,
    theme: 'default',
    uncheckedLabel: 'Disabled',
    value: '',
    animateLabel: label => label,
    onChange: () => {},
  }

  state = {
    checked: this.props.checked,
    active: false,
  };

  constructor(props) {
    super(props);
    inject(styles, 'junipero-toggle-styles');
  }

  componentDidUpdate(prevProps) {
    if (this.props.checked !== prevProps.checked) {
      this.onChange(null, this.props.checked);
    }
  }

  reset() {
    this.setState({
      checked: this.props.checked,
    }, () => {
      this.props.onChange({});
    });
  }

  onChange(e, forceValue) {
    if (this.props.disabled) {
      return;
    }

    const checked = typeof forceValue !== 'undefined' && forceValue !== null
      ? forceValue
      : e.target.checked;

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
    const {
      disabled,
      theme,
      value,
      className,
      checkedLabel,
      uncheckedLabel,
      animateLabel,
      ...rest
    } = this.props;
    const { active, checked } = this.state;
    return (
      <div
        className={classNames(
          'junipero',
          'junipero-toggle',
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
          className="toggle-wrapper"
        >
          <div className="toggle-inner">
            <input
              { ...omit(rest, [
                'onChange', 'checked',
              ])}
              type="checkbox"
              onChange={this.onChange.bind(this)}
              value={value}
              checked={checked}
              disabled={disabled}
            />
            <div className="toggle">
              <div className="handle" />
            </div>
          </div>

          <div className="label">
            { animateLabel(checked ? checkedLabel : uncheckedLabel) }
          </div>

        </label>
      </div>
    );
  }

}

export default Toggle;
