import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles, omit, classNames } from '../utils';
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
    animateLabel: PropTypes.func,
  }

  static defaultProps = {
    className: null,
    checked: false,
    value: null,
    disabled: false,
    required: false,
    onChange: () => {},
    theme: 'default',
    animateLabel: label => label,
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
      onLabel,
      offLabel,
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
            { animateLabel(checked ? onLabel : offLabel) }
          </div>

        </label>
      </div>
    );
  }

}

export default Toggle;
