import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { injectStyles } from '../utils';
import styles from '../theme/components/Modal.styl';

class Modal extends React.Component {

  static propTypes = {
    classname: PropTypes.string,
    theme: PropTypes.string,
    container: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    disabled: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    classname: null,
    theme: 'default',
    container: 'body',
    disabled: false,
    onOpen: () => {},
    onClose: () => {},
  }

  state = {
    opened: false,
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-modal-styles', after: '#junipero-main-styles' });
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
    const { theme, children } = this.props;
    const { opened } = this.state;

    if (!opened) {
      return null;
    }

    return ReactDOM.createPortal(
      (
        <div
          className={[
            'junipero',
            'junipero-modal',
            'theme-' + theme,
          ].join(' ')}
        >
          <div
            ref={(ref) => this.backdrop = ref}
            role="presentation"
            className="modal-wrapper"
            onClick={this.onBackdropClick.bind(this)}
          >
            <div className="modal-content">
              <a
                className="modal-close"
                role="button"
                tabIndex={-1}
                onClick={this.close.bind(this)}
              />

              { children }
            </div>
          </div>
        </div>
      ),
      this.getContainer()
    );
  }
}

export default Modal;
