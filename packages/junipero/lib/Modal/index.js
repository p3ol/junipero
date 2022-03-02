import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { classNames, mockState, ensureNode } from '@poool/junipero-utils';

const Modal = forwardRef(({
  animate,
  children,
  className,
  apparition = 'insert',
  container = 'body',
  disabled = false,
  opened = false,
  closable = true,
  onToggle = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();
  const contentRef = useRef();
  const wrapperRef = useRef();
  const closeButtonRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    opened,
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
  }));

  useEffect(() => {
    dispatch({ opened });
  }, [opened]);

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
    onToggle({ opened: true });
  };

  const close = () => {
    if (disabled) {
      return;
    }

    dispatch({ opened: false });
    onToggle({ opened: false });
  };

  const toggle = () => {
    if (disabled) {
      return;
    }

    state.opened = !state.opened;
    dispatch({ opened: state.opened });
    onToggle({ opened: state.opened });
  };

  if (!state.opened && !animate && apparition === 'insert') {
    return null;
  }

  const wrapper = (
    <div
      { ...rest }
      ref={innerRef}
      className={classNames(
        'junipero',
        'modal',
        {
          'apparition-css': apparition === 'css',
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
            />
          ) }
          { children }
        </div>
      </div>
    </div>
  );

  return createPortal(
    animate ? animate(wrapper, { opened: state.opened }) : wrapper,
    ensureNode(container)
  );
});

Modal.propTypes = {
  animate: PropTypes.func,
  apparition: PropTypes.string,
  container: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object,
  ]),
  closable: PropTypes.bool,
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  opened: PropTypes.bool,
};

export default Modal;
