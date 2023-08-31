import {
  ComponentPropsWithRef,
  MutableRefObject,
  ReactNode,
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
import { ForwardedProps } from '../utils';

export declare type ModalRef = {
  isJunipero: boolean;
  opened: boolean;
  close(): void;
  open(): void;
  toggle(): void;
  closeButtonRef: MutableRefObject<any>;
  contentRef: MutableRefObject<any>;
  innerRef: MutableRefObject<any>;
  wrapperRef: MutableRefObject<any>;
};

declare interface ModalProps extends ComponentPropsWithRef<any> {
  apparition?: string;
  children?: ReactNode | JSX.Element;
  className?: string;
  container?: Element | DocumentFragment;
  disabled?: boolean;
  opened?: boolean;
  closable?: boolean;
  animate?(
    modal: ReactNode | JSX.Element,
    options: { opened: boolean, onExited: () => void }
  ): JSX.Element;
  onToggle?(props: { opened: boolean }): void;
  ref?: MutableRefObject<ModalRef | undefined>;
}

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
}: ModalProps, ref) => {
  const innerRef = useRef();
  const contentRef = useRef();
  const wrapperRef = useRef();
  const closeButtonRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    opened: opened ?? false,
    visible: opened ?? false,
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
    ? container ? createPortal(content, container) : content
    : null;
}) as ForwardedProps<ModalProps, ModalRef>;

Modal.displayName = 'Modal';
Modal.propTypes = {
  animate: PropTypes.func,
  apparition: PropTypes.string,
  container: PropTypes.oneOfType([
    PropTypes.any, //TODO find a way to check if it's a valid DOM node
  ]),
  closable: PropTypes.bool,
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  opened: PropTypes.bool,
};

export default Modal;
