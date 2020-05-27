import React from 'react';
import PropTypes from 'prop-types';

import { inject } from './style';
import { omit, classNames } from './utils';
import styles from './theme/components/CheckBox.styl';

export default class CheckBox extends React.Component {

  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    theme: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    checked: false,
    disabled: false,
    required: false,
    theme: 'default',
    value: '',
    onChange: () => {},
  }

  state = {
    active: false,
    checked: this.props.checked,
  }

  constructor (props) {
    super(props);
    inject(styles, 'junipero-check-box-styles');
  }

  componentDidMount () {
    if (typeof document === 'undefined') {
      return;
    }

    document.addEventListener('mouseup', this.onMouseUp, false);
  }

  componentDidUpdate (prevProps) {
    if (this.props.checked !== prevProps.checked) {
      this.setState({
        active: false,
        checked: this.props.checked,
      });
    }
  }

  reset () {
    this.setState({
      active: false,
      checked: this.props.checked,
    }, () => {
      this.props.onChange({
        value: this.props.checked ? this.props.value : null,
        checked: this.props.checked,
      });
    });
  }

  onChange (e) {
    e.persist?.();

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

  onMouseDown () {
    if (this.props.disabled) {
      return;
    }

    this.setState({ active: true });
  }

  onMouseUp = () => {
    this.setState({ active: false });
  }

  render () {
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
        >
          <div className="check-inner">
            <input
              { ...omit(rest, [
                'onChange', 'checked',
              ]) }
              type="checkbox"
              onChange={this.onChange.bind(this)}
              value={value}
              checked={checked}
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

  componentWillUnmount () {
    if (typeof document === 'undefined') {
      return;
    }

    document.removeEventListener('mouseup', this.onMouseUp);
  }

}
