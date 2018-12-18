import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { inject } from './style';
import { omit, classNames } from './utils';
import styles from './theme/components/Modal.styl';

class Modal extends React.Component {

  static propTypes = {
    apparition: PropTypes.string,
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    theme: PropTypes.string,
    animate: PropTypes.func,
    animateContent: PropTypes.func,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
  }

  static defaultProps = {
    apparition: 'insert',
    container: 'body',
    disabled: false,
    theme: 'default',
    animate: modal => modal,
    animateContent: content => content,
    onClose: () => {},
    onOpen: () => {},
  }

  state = {
    opened: false,
  }

  constructor(props) {
    super(props);
    inject(styles, 'junipero-modal-styles');
  }

  getContainer() {
    const { container } = this.props;

    return typeof container === 'string'
      ? document.querySelector(container) || document.createElement('div')
      : container;
  }

  open() {
    const { disabled, onOpen } = this.props;

    if (disabled) {
      return;
    }

    this.setState({
      opened: true,
    }, () => {
      onOpen();
    });
  }

  close() {
    const { disabled, onClose } = this.props;

    if (disabled) {
      return;
    }

    this.setState({
      opened: false,
    }, () => {
      onClose();
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
      theme,
      children,
      apparition,
      animate,
      animateContent,
      ...rest
    } = this.props;
    const { opened } = this.state;

    if (!opened && apparition === 'insert') {
      return null;
    }

    return ReactDOM.createPortal(
      animate(
        <div
          { ...omit(rest, [
            'onOpen', 'onClose',
          ]) }
          className={classNames(
            'junipero',
            'junipero-modal',
            'theme-' + theme,
            { opened },
            className,
          )}
        >
          <div
            ref={(ref) => this.backdrop = ref}
            role="presentation"
            className="modal-wrapper"
            onClick={this.onBackdropClick.bind(this)}
          >
            { animateContent(
              <div className="modal-content">
                <a
                  className="modal-close"
                  role="button"
                  tabIndex={-1}
                  onClick={this.close.bind(this)}
                />

                { children }
              </div>
            ) }
          </div>
        </div>
      ),
      this.getContainer()
    );
  }
}

export default Modal;
