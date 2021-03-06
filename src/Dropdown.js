import React from 'react';
import PropTypes from 'prop-types';
import { Manager } from 'react-popper';

import { inject } from './style';
import { omit, classNames } from './utils';
import DropdownMenu from './DropdownMenu';
import styles from './theme/components/Dropdown.styl';

export default class Dropdown extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    placement: PropTypes.string,
    tag: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.object,
      PropTypes.node,
    ]),
    theme: PropTypes.string,
    onToggle: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    isOpen: false,
    placement: 'bottom-start',
    tag: 'div',
    theme: 'default',
    onToggle: () => {},
  }

  static childContextTypes = {
    disabled: PropTypes.bool,
    theme: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    placement: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  state = {
    opened: this.props.isOpen || false,
  }

  dropdownRef = null

  menuRef = null

  constructor (props) {
    super(props);
    inject(styles, 'junipero-dropdown-styles');
  }

  componentDidMount () {
    if (typeof document === 'undefined') {
      return;
    }

    document.addEventListener('click', this.onClickOutside, false);
  }

  componentDidUpdate (prevProps) {
    if (this.props.disabled !== prevProps.disabled) {
      this.close();
    }

    if (this.props.isOpen !== prevProps.isOpen) {
      this.onChange(this.props.isOpen);
    }
  }

  getChildContext () {
    return {
      disabled: this.props.disabled,
      theme: this.props.theme,
      placement: this.props.placement,
      isOpen: this.state.opened,
      onToggle: this.toggle.bind(this),
    };
  }

  onClickOutside = e => {
    const container = this.dropdownRef;
    const menu = this.menuRef?.innerRef;

    if (!container || !menu) {
      return;
    }

    if (
      !container.contains(e.target) &&
      container !== e.target &&
      !menu.contains(e.target) &&
      menu !== e.target
    ) {
      this.close(e);
    }
  }

  open (e) {
    if (this.props.disabled) {
      e?.preventDefault();
      return;
    }

    this.onChange(true);
  }

  close () {
    this.onChange(false);
  }

  toggle (e) {
    this.state.opened ? this.close() : this.open(e);
  }

  onChange (opened) {
    this.setState({
      opened,
    }, () => {
      this.props.onToggle(opened);
    });
  }

  render () {
    const {
      className,
      theme,
      disabled,
      children,
      tag: Tag,
      ...rest
    } = omit(this.props);
    const { opened } = this.state;

    return (
      <Manager>
        <Tag
          { ...omit(rest, [
            'onToggle', 'placement', 'isOpen',
          ])}
          ref={ref => { this.dropdownRef = ref; }}
          className={classNames(
            'junipero',
            'junipero-dropdown',
            'theme-' + theme,
            {
              opened,
              disabled,
            },
            className,
          )}
        >
          { React.Children.map(children, child =>
            child.type === DropdownMenu
              ? React.cloneElement(child, {
                ref: ref => {
                  this.menuRef = ref;
                  child.ref?.(ref);
                },
              })
              : child
          ) }
        </Tag>
      </Manager>
    );
  }

  componentWillUnmount () {
    if (typeof document === 'undefined') {
      return;
    }

    document.removeEventListener('click', this.onClickOutside);
  }

}
