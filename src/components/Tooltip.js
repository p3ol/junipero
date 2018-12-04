import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Manager, Reference, Popper } from 'react-popper';

import { injectStyles, getContainerNode, omit } from '../utils';
import styles from '../theme/components/Tooltip.styl';

class Tooltip extends React.Component {

  static propTypes = {
    classname: PropTypes.string,
    text: PropTypes.string,
    placement: PropTypes.string,
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    trigger: PropTypes.string,
    onToggle: PropTypes.func,
    theme: PropTypes.string,
    apparition: PropTypes.oneOf(['insert', 'css']),
  }

  static defaultProps = {
    text: '',
    placement: 'top',
    trigger: 'hover',
    onToggle: () => {},
    theme: 'default',
    apparition: 'insert',
  }

  state = {
    opened: false,
  };

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
            React.cloneElement(
              React.Children.only(children),
              { ref: ref }
            )
          )}
        </Reference>
        { opened || apparition === 'css' ? (
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
