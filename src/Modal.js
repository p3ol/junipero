import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { inject } from './style';
import { getContainerNode, omit, classNames } from './utils';
import styles from './theme/components/Modal.styl';

class Modal extends React.Component {

  static propTypes = {
    apparition: PropTypes.string,
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    theme: PropTypes.string,
    animate: PropTypes.func,
    animateContent: PropTypes.func,
    onToggle: PropTypes.func,
  }

  static defaultProps = {
    apparition: 'insert',
    container: 'body',
    disabled: false,
    theme: 'default',
    onToggle: () => {},
  }

  state = {
    opened: false,
  }

  constructor(props) {
    super(props);
    inject(styles, 'junipero-modal-styles');
  }

  open() {
    this.toggle(true);
  }

  close() {
    this.toggle(false);
  }

  toggle(opened) {
    const { disabled, onToggle } = this.props;

    if (disabled) {
      return;
    }

    this.setState({
      opened,
    }, () => {
      onToggle(opened);
    });
  }

  onBackdropClick(e) {
    if (e.target === this.backdrop) {
      this.close();
    }
  }

  render() {
    const {
      className,
      container,
      theme,
      children,
      apparition,
      animate,
      animateContent,
      ...rest
    } = this.props;
    const { opened } = this.state;

    if (!opened && !animate && apparition === 'insert') {
      return null;
    }

    const modalContent = (
      <div className="junipero-modal-content">
        <a
          className="junipero-modal-close"
          role="button"
          tabIndex={-1}
          onClick={this.close.bind(this)}
        />

        { children }
      </div>
    );

    const modalWrapper = (
      <div
        { ...omit(rest, [
          'onToggle',
        ]) }
        className={classNames(
          'junipero',
          'junipero-modal',
          'theme-' + theme,
          {
            opened: !animate && opened,
            closed: !animate && !opened,
          },
          className,
        )}
      >
        <div
          ref={(ref) => this.backdrop = ref}
          role="presentation"
          className="junipero-modal-wrapper"
          onClick={this.onBackdropClick.bind(this)}
        >
          { animateContent ? animateContent(modalContent) : modalContent }
        </div>
      </div>
    );

    return ReactDOM.createPortal(
      animate ? animate(modalWrapper) : modalWrapper,
      getContainerNode(container)
    );
  }
}

export default Modal;
