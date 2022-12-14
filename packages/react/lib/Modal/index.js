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
  const [state, dispatch] = useReducer(mockState, {
    opened: opened ?? false,
  });

  useImperativeHandle(ref, () => ({
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

  const open = () => {
    if (disabled) {
      return;
    }

    dispatch({ opened: true });
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

    state.opened = !state.opened;
    dispatch({ opened: state.opened });
    onToggle?.({ opened: state.opened });
  };

  const Wrapper = ({ transitionState }) => (
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
              onClick={onBackdropClick}
            >
              <Remove />
            </a>
          ) }
          {(!transitionState || ['entered', 'exiting'].find(
            state => state === transitionState)
          ) &&
            children
          }
        </div>
      </div>
    </div>
  );
  Wrapper.propTypes = {
    transitionState: PropTypes.string,
  };
  const content = animate
    ? animate(Wrapper, { opened: state.opened }) : <Wrapper />;

  return state.opened || animate || apparition === 'css'
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
