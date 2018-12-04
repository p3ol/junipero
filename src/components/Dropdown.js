import React from 'react';
import PropTypes from 'prop-types';
import { Manager } from 'react-popper';
import classNames from 'classnames';

import { omit, injectStyles } from '../utils';
import DropdownMenu from './DropdownMenu';
import styles from '../theme/components/Dropdown.styl';

class Dropdown extends React.Component {

  static propTypes = {
    theme: PropTypes.string,
    disabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    placement: PropTypes.string,
    tag: PropTypes.string,
    onToggle: PropTypes.func,
  }

  static defaultProps = {
    theme: 'default',
    disabled: false,
    isOpen: false,
    tag: 'div',
    placement: 'bottom-start',
    onToggle: () => {},
  }

  static childContextTypes = {
    disabled: PropTypes.bool,
    theme: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    placement: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  dropdownRef = null;

  menuRef = null;

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-dropdown-styles', after: '#junipero-main-styles' });
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside.bind(this), false);
  }

  componentDidUpdate(prevProps) {
    if (this.props.disabled !== prevProps.disabled) {
      this.close();
    }
  }

  getChildContext() {
    return {
      disabled: this.props.disabled,
      theme: this.props.theme,
      placement: this.props.placement,
      isOpen: this.props.isOpen,
      onToggle: this.toggle.bind(this),
    };
  }

  onClickOutside(e) {
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

  open(e) {
    if (this.props.disabled) {
      return e && e.preventDefault();
    }

    return this.props.onToggle(true);
  }

  close(e) {
    return this.props.onToggle(false);
  }

  toggle(e) {
    this.props.isOpen
      ? this.close(e)
      : this.open(e);
  }

  render() {
    const {
      className,
      isOpen,
      theme,
      disabled,
      children,
      tag: Tag,
      ...rest
    } = omit(this.props);

    return (
      <Manager>
        <Tag
          { ...omit(rest, [
            'onToggle', 'placement',
          ])}
          ref={(ref) => this.dropdownRef = ref}
          className={classNames(
            'junipero',
            'junipero-dropdown',
            'theme-' + theme,
            {
              opened: isOpen,
              disabled,
            },
            className,
          )}
        >
          { React.Children.map(children, (child, index) => (
            child.type === DropdownMenu
              ? React.cloneElement(child, { ref: (ref) => this.menuRef = ref})
              : child
          )) }
        </Tag>
      </Manager>
    );
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside.bind(this));
  }

}

export default Dropdown;
