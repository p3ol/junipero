import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles, omit, classNames } from '../utils';
import styles from '../theme/components/Toggle.styl';

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

    injectStyles(styles,
      { id: 'junipero-toggle-styles', after: '#junipero-main-styles' });
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
