import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles } from '../utils';

import styles from '../theme/components/Tooltip.styl';

const propTypes = {
  classname: PropTypes.string,
  text: PropTypes.string,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  elementId: PropTypes.string,
  maxWidth: PropTypes.number,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  hideArrow: PropTypes.bool,
  eventType: PropTypes.string,
};

const defaultProps = {
  classname: null,
  text: 'This is a tooltip',
  placement: 'top',
  elementId: null,
  onChange: () => {},
  maxWidth: 150,
  disabled: false,
  hideArrow: false,
  eventType: 'hover',
};

class Tooltip extends React.Component {

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-tooltip-styles', after: '#junipero-main-styles' });

    this.state = {
      opened: false,
      tipWidth: this.props.maxWidth || null,
      tipHeight: null,
      targetWidth: null,
      targetHeight: null,
    };
  }

  componentDidMount() {
    if (!this.props.elementId || this.props.disabled) {
      return;
    }
    this.getTipDimensions(this.tooltipRef);
    this.bindListeners();
  }

  bindListeners() {
    let target = document.getElementById(this.props.elementId);
    this.getTargetDimensions(target);
    if (this.props.eventType == 'click') {
      target.addEventListener('click', this.toggleTooltip.bind(this));
    } else {
      target.addEventListener('mouseenter', this.toggleTooltip.bind(this));
      target.addEventListener('mouseleave', this.toggleTooltip.bind(this));
    }
  }

  toggleTooltip() {
    if (this.props.disabled) { return; }
    this.setState({ opened: !this.state.opened }, () => {
      this.props.onChange({ opened: this.state.opened });
    });
  }

  getTargetDimensions(target) {
    const { height, width } = target.getBoundingClientRect();
    return this.setState({
      targetWidth: parseInt(width, 10),
      targetHeight: parseInt(height, 10),
    });
  }

  getTipDimensions(tip) {
    return this.setState({
      tipWidth: parseInt(tip.offsetWidth, 10),
      tipHeight: parseInt(tip.offsetHeight, 10),
    });
  }

  getPosition() {
    const disToMouse = 3;
    const triangleHeight = 2;
    switch (this.props.placement) {
      case 'right':
        return {
          left: this.state.targetWidth + disToMouse + triangleHeight,
          top: -this.state.targetHeight + disToMouse + triangleHeight,
          width: this.state.tipWidth,
        };
      case 'left':
        return {
          left: -(this.state.tipWidth + disToMouse + triangleHeight),
          top: -this.state.targetHeight + disToMouse + triangleHeight,
          width: this.state.tipWidth,
        };
      case 'top':
        return {
          left: this.state.targetWidth / 2,
          top: -(this.state.targetHeight + this.state.tipHeight +
            triangleHeight + disToMouse),
          width: this.state.tipWidth,
        };
      case 'bottom':
        return {
          left: this.state.targetWidth / 2,
          top: disToMouse + triangleHeight,
          width: this.state.tipWidth,
        };
      default:
        return {
          width: this.state.tipWidth,
        };
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.disabled != this.props.disabled && this.props.disabled) {
      this.setState({ opened: false });
    }
  }

  render() {
    const tooltipPosition = this.getPosition();
    return (
      <div className="junipero junipero-tooltip">
        <div
          ref={(ref) => this.tooltipRef = ref}
          className={[
            'junipero-tooltip-inner',
            'place-' + this.props.placement,
            this.state.opened ? 'opened' : null,
            this.props.hideArrow ? 'hide-arrow' : null,
            this.props.className,
          ].join(' ')}
          style={tooltipPosition}
        >
          {this.props.text}
        </div>
      </div>
    );
  }

  unBindListeners() {
    if (!this.props.elementId) {
      return;
    }
    let elem = document.getElementById(this.props.elementId);
    elem.removeEventListener('mouseenter', this.toggleTooltip.bind(this));
    elem.removeEventListener('mouseleave', this.toggleTooltip.bind(this));
  }

  componentWillUnMount() {
    this.unBindListeners();
  }
}

Tooltip.propTypes = propTypes;
Tooltip.defaultProps = defaultProps;

export default Tooltip;
