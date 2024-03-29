import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { classNames, mockState, ensureNode } from '@junipero/core';

import { Remove } from '../icons';
import { useModal } from '../hooks';

const Modal = forwardRef(({
  animate,
  children,
  className,
  apparition,
  container,
  disabled,
  opened,
  closable = true,
  onToggle,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const contentRef = useRef();
  const wrapperRef = useRef();
  const closeButtonRef = useRef();
  const { setRef: setControlRef } = useModal();
  const [state, dispatch] = useReducer(mockState, {
    opened: opened ?? false,
    visible: opened ?? false,
  });

  useImperativeHandle(r => {
    setControlRef?.(r);

    if (typeof ref === 'function') {
      ref(r);
    } else if (ref) {
      ref.current = r;
    }
  }, () => ({
    innerRef,
    contentRef,
    wrapperRef,
    closeButtonRef,
    opened: state.opened,
    open,
    close,
    toggle,
    isJunipero: true,
  }));

  useEffect(() => {
    dispatch({ opened: disabled ? false : !!opened });
  }, [disabled, opened]);

  const onBackdropClick = e => {
    if (
      disabled ||
      !closable ||
      (e.target !== wrapperRef.current && e.target !== closeButtonRef?.current)
    ) {
      return;
    }

    e.preventDefault();
    close();
  };

  const onCloseClick = e => {
    e.preventDefault();

    if (disabled || !closable) {
      return;
    }

    close();
  };

  const open = () => {
    if (disabled) {
      return;
    }

    dispatch({ opened: true, visible: true });
    onToggle?.({ opened: true });
  };

  const close = () => {
    if (disabled) {
      return;
    }

    dispatch({ opened: false });
    onToggle?.({ opened: false });
  };

  const toggle = () => {
    if (disabled) {
      return;
    }

    if (state.opened) {
      close();
    } else {
      open();
    }
  };

  const onAnimationExit = () => {
    dispatch({ visible: false });
  };

  const wrapper = (
    <div
      { ...rest }
      ref={innerRef}
      className={classNames(
        'junipero',
        'modal',
        {
          opened: state.opened,
        },
        className,
      )}
    >
      <div
        tabIndex={0}
        onClick={onBackdropClick}
        ref={wrapperRef}
        className="wrapper"
      >
        <div ref={contentRef} className="content">
          { closable && (
            <a
              href="#"
              ref={closeButtonRef}
              className="close"
              onClick={onCloseClick}
            >
              <Remove />
            </a>
          ) }
          { children }
        </div>
      </div>
    </div>
  );

  const content = animate
    ? animate(wrapper, {
      opened: state.opened,
      onExited: onAnimationExit,
    }) : wrapper;

  return state.opened || (animate && state.visible) || apparition === 'css'
    ? container ? createPortal(content, ensureNode(container)) : content
    : null;
});

Modal.displayName = 'Modal';
Modal.propTypes = {
  animate: PropTypes.func,
  apparition: PropTypes.string,
  container: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
    PropTypes.func,
  ]),
  closable: PropTypes.bool,
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  opened: PropTypes.bool,
};

export default Modal;
