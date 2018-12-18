import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';

import { inject } from './style';
import { getContainerNode, omit, classNames } from './utils';
import styles from './theme/components/Tooltip.styl';

class Tooltip extends React.Component {

  static propTypes = {
    apparition: PropTypes.oneOf(['insert', 'css']),
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    placement: PropTypes.string,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    theme: PropTypes.string,
    trigger: PropTypes.string,
    animate: PropTypes.func,
    onToggle: PropTypes.func,
  }

  static defaultProps = {
    apparition: 'insert',
    container: null,
    disabled: false,
    placement: 'top',
    text: '',
    trigger: 'hover',
    theme: 'default',
    animate: tooltip => tooltip,
    onToggle: () => {},
  }

  state = {
    opened: false,
  };

  constructor(props) {
    super(props);
    inject(styles, 'junipero-tooltip-styles');
  }

  componentDidMount() {
    const { trigger } = this.props;

    switch (trigger) {
      case 'click':
        this.target?.addEventListener('click', this.toggleTooltip, false);
        document.addEventListener('click', this.onClickOutside, false);
        break;
      default:
        this.target?.addEventListener('mouseenter', this.openTooltip, false);
        this.target?.addEventListener('mouseleave', this.closeTooltip, false);
        break;
    }
  }

  onClickOutside = (e) => {
    if (this.target && !this.target.contains(e.target)) {
      this.toggleTooltip(false);
    }
  }

  openTooltip = () => {
    this.toggleTooltip(true);
  }

  closeTooltip = () => {
    this.toggleTooltip(false);
  }

  toggleTooltip = (forceOpen) => {
    const { disabled, onToggle } = this.props;

    if (disabled) {
      return;
    }

    const opened = typeof forceOpen === 'boolean'
      ? forceOpen
      : !this.state.opened;

    this.setState({ opened }, () => onToggle(opened));
  }

  getContainer() {
    const { container } = this.props;

    return typeof container === 'string'
      ? document.querySelector(container) || document.createElement('div')
      : container;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.disabled != this.props.disabled && this.props.disabled) {
      this.setState({ opened: false });
    }
  }

  render() {
    const {
      text,
      className,
      children,
      placement,
      theme,
      container,
      apparition,
      animate,
      ...rest
    } = this.props;
    const { opened } = this.state;

    const tooltip = (
      <Popper
        placement={placement}
      >
        { ({ ref, style, placement, arrowProps }) => (
          <div
            { ...omit(rest, [
              'trigger',
            ]) }
            className={classNames(
              'junipero',
              'junipero-tooltip',
              'theme-' + theme,
              { opened },
              className,
            )}
            ref={ref}
            style={style}
            data-placement={placement}
          >
            { text }

            <i
              className="arrow"
              ref={arrowProps.ref}
              style={arrowProps.style}
            />
          </div>
        ) }
      </Popper>
    );

    return (
      <Manager>
        <Reference
          innerRef={(ref) => this.target = ref}
        >
          { ({ ref }) => (
            typeof children === 'string' ? (
              <span ref={ref}>{ children }</span>
            ) : React.cloneElement(
              React.Children.only(children),
              { ref: ref }
            )
          )}
        </Reference>
        { opened || apparition === 'css' ? animate(
          container
            ? ReactDOM.createPortal(tooltip, getContainerNode(container))
            : tooltip
        ) : null}
      </Manager>
    );

  }

  componentWillUnMount() {
    const { trigger } = this.props;

    switch (trigger) {
      case 'click':
        this.target?.removeEventListener('click', this.toggleTooltip);
        document.removeEventListener('click', this.onClickOutside);
        break;
      default:
        this.target?.removeEventListener('mouseenter', this.openTooltip);
        this.target?.removeEventListener('mouseleave', this.closeTooltip);
        break;
    }
  }
}

export default Tooltip;
