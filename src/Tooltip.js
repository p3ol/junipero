import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';

import { inject } from './style';
import { getContainerNode, omit, classNames } from './utils';
import styles from './theme/components/Tooltip.styl';

export default class Tooltip extends React.Component {

  static propTypes = {
    apparition: PropTypes.oneOf(['insert', 'css']),
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    placement: PropTypes.string,
    popperOptions: PropTypes.object,
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
    popperOptions: {},
    text: '',
    trigger: 'hover',
    theme: 'default',
    onToggle: () => {},
  }

  state = {
    opened: false,
  };

  scheduleUpdate = null

  constructor (props) {
    super(props);
    inject(styles, 'junipero-tooltip-styles');
  }

  componentDidMount () {
    if (this.props.trigger === 'click') {
      document.addEventListener('click', this.onClickOutside, false);
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.disabled !== this.props.disabled && this.props.disabled) {
      this.setState({ opened: false });
    }
  }

  onClickOutside = (e) => {
    if (this.target && !this.target.contains(e?.target)) {
      this.toggleTooltip(false);
    }
  }

  open = () => {
    this.toggleTooltip(true);
  }

  close = () => {
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

  updatePopper () {
    this.scheduleUpdate?.();
  }

  getHandlers () {
    const { trigger } = this.props;
    const handlers = {};

    switch (trigger) {
      case 'click':
        handlers.onClick = this.toggleTooltip;
        break;
      case 'hover':
        handlers.onMouseEnter = this.open;
        handlers.onMouseLeave = this.close;
    }

    return handlers;
  }

  render () {
    const {
      text,
      className,
      children,
      placement,
      theme,
      container,
      apparition,
      animate,
      popperOptions,
      ...rest
    } = this.props;
    const { opened } = this.state;

    const tooltip = (
      <Popper
        {...popperOptions}
        placement={placement}
      >
        { ({ ref, style, placement, arrowProps, scheduleUpdate }) => {
          this.scheduleUpdate = scheduleUpdate;

          return (
            <div
              { ...omit(rest, [
                'trigger',
              ]) }
              className={classNames(
                'junipero',
                'junipero-tooltip',
                'theme-' + theme,
                {
                  opened: !animate && opened,
                  closed: !animate && !opened,
                },
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
          );
        } }
      </Popper>
    );

    return (
      <Manager>
        <Reference
          innerRef={ref => { this.target = ref; }}
        >
          { ({ ref }) => (
            !children || typeof children === 'string' ? (
              <span
                className="tooltip-toggle"
                ref={ref}
                {...this.getHandlers()}
                children={children}
              />
            ) : React.cloneElement(
              React.Children.only(children),
              { ref, ...this.getHandlers() }
            )
          )}
        </Reference>
        { opened || animate || apparition === 'css'
          ? container
            ? ReactDOM.createPortal(
              animate ? animate(tooltip) : tooltip,
              getContainerNode(container)
            )
            : animate ? animate(tooltip) : tooltip
          : null
        }
      </Manager>
    );

  }

  componentWillUnmount () {
    try {
      document.removeEventListener('click', this.onClickOutside);
    } catch (e) {}
  }

}
