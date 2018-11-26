import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { injectStyles } from '../utils';
import styles from '../theme/components/Tooltip.styl';

class Tooltip extends React.Component {

  static propTypes = {
    classname: PropTypes.string,
    text: PropTypes.string,
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    trigger: PropTypes.string,
    onToggle: PropTypes.func,
    theme: PropTypes.string,
  }

  static defaultProps = {
    classname: null,
    text: '',
    placement: 'top',
    container: 'body',
    trigger: 'hover',
    onToggle: () => {},
    theme: 'default',
  }

  state = {
    opened: false,
    x: 0,
    y: 0,
  }

  xCenteredPositions = ['top', 'bottom']

  yCenteredPositions = ['left', 'right']

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-tooltip-styles', after: '#junipero-main-styles' });
  }

  componentDidMount() {
    const { trigger } = this.props;

    switch (trigger) {
      case 'click':
        this.target?.addEventListener('click',
          this.toggleTooltip.bind(this), false);
        document.addEventListener('click',
          this.onClickOutside.bind(this), false);
        break;
      default:
        this.target?.addEventListener('mouseenter',
          this.toggleTooltip.bind(this, true), false);
        this.target?.addEventListener('mouseleave',
          this.toggleTooltip.bind(this, false), false);
        break;
    }

    this.updatePosition();
  }

  onClickOutside(e) {
    if (this.target && !this.target.contains(e.target)) {
      this.toggleTooltip(false);
    }
  }

  toggleTooltip(forceOpen) {
    const { disabled, onToggle } = this.props;

    if (disabled) {
      return;
    }

    const opened = typeof forceOpen === 'boolean'
      ? forceOpen
      : !this.state.opened;

    if (opened) {
      this.updatePosition();
    }

    this.setState({ opened }, () => onToggle(opened));
  }

  getContainer() {
    const { container } = this.props;

    return typeof container === 'string'
      ? document.querySelector(container) || document.createElement('div')
      : container;
  }

  updatePosition() {
    const { placement } = this.props;

    const {
      top: childTop,
      left: childLeft,
      width: childWidth,
      height: childHeight,
    } = this.target.getBoundingClientRect();

    const {
      top: parentTop,
      left: parentLeft,
    } = this.getContainer().getBoundingClientRect();

    const {
      width: tooltipWidth,
      height: tooltipHeight,
    } = this.tooltip.getBoundingClientRect();

    this.setState({
      x: (
        this.xCenteredPositions.includes(placement)
          ? childLeft + (childWidth / 2)
          : placement === 'left'
            ? childLeft - tooltipWidth
            : childLeft + childWidth
      ) - parentLeft,
      y: (
        this.yCenteredPositions.includes(placement)
          ? childTop + (childHeight / 2)
          : placement === 'top'
            ? childTop - tooltipHeight
            : childTop + childHeight
      ) - parentTop,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.disabled != this.props.disabled && this.props.disabled) {
      this.setState({ opened: false });
    }
  }

  render() {
    const { text, className, children, placement, theme } = this.props;
    const { opened, x, y } = this.state;

    return (
      <React.Fragment>
        { React.cloneElement(
          React.Children.only(children),
          { ref: (ref) => this.target = ref }
        ) }

        { ReactDOM.createPortal(
          (
            <div
              className={[
                'junipero',
                'junipero-tooltip',
                'theme-' + theme,
                'placement-' + placement,
                opened ? 'opened' : null,
                className,
              ].join(' ')}
              ref={(ref) => this.tooltip = ref}
              style={{
                top: y + 'px',
                left: x + 'px',
              }}
            >
              { text }
            </div>
          ),
          this.getContainer()
        )}
      </React.Fragment>
    );
  }

  componentWillUnMount() {
    const { trigger } = this.props;

    switch (trigger) {
      case 'click':
        this.target?.removeEventListener('click',
          this.toggleTooltip.bind(this));
        break;
      default:
        this.target?.removeEventListener('mouseenter',
          this.toggleTooltip.bind(this));
        this.target?.removeEventListener('mouseleave',
          this.toggleTooltip.bind(this));
        break;
    }
  }
}

export default Tooltip;
