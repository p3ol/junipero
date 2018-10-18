import React from 'react';
import PropTypes from 'prop-types';

import '../theme/components/CheckBox.styl';

const propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  value: PropTypes.string,
  checkIconComponent: PropTypes.object,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};

const defaultProps = {
  className: null,
  checked: false,
  value: null,
  disabled: false,
  required: false,
  checkIconComponent: null,
  onChange: () => {},
};

class CheckBox extends React.Component {

  constructor(props) {
    super(props);

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
          'udf',
          'check-box',
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
            <div className="check">
              { this.props.checkIconComponent || (
                <i className="check-icon" />
              ) }
            </div>
          </div>

          <div className="label">
            { this.props.children }
          </div>
        </label>
      </div>
    );
  }

}

CheckBox.propTypes = propTypes;
CheckBox.defaultProps = defaultProps;

export default CheckBox;
