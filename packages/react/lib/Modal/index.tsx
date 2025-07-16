import {
  type MouseEvent,
  type RefObject,
  type ReactNode,
  type ReactElement,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { classNames, ensureNode, mockState } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import type { TransitionProps } from '../Transition';
import { useModal } from '../hooks';
import { Remove } from '../icons';

export declare interface ModalRef extends JuniperoRef {
  opened: boolean;
  close(): void;
  open(): void;
  toggle(): void;
  closeButtonRef: RefObject<HTMLAnchorElement>;
  contentRef: RefObject<HTMLDivElement>;
  innerRef: RefObject<HTMLDivElement>;
  wrapperRef: RefObject<HTMLDivElement>;
}

export declare interface ModalProps extends Omit<
  SpecialComponentPropsWithRef<'div', ModalRef>,
  'onToggle'
> {
  apparition?: string;
  container?: string | ReactElement | DocumentFragment | HTMLElement;
  disabled?: boolean;
  opened?: boolean;
  closable?: boolean;
  animate?(
    modal: ReactNode,
    opts: {
      opened: boolean;
    } & Partial<TransitionProps>
  ): ReactNode;
  onToggle?(props: { opened: boolean }): void;
}

export declare interface ModalState {
  opened: boolean;
  visible: boolean;
}

const Modal = ({
  ref,
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
}: ModalProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLAnchorElement>(null);
  const { setRef: setControlRef } = useModal();
  const [state, dispatch] = useReducer(mockState<ModalState>, {
    opened: opened ?? false,
    visible: opened ?? false,
  });

  useImperativeHandle((r: ModalRef) => {
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

  const onBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
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

  const onCloseClick = (e: MouseEvent<HTMLAnchorElement>) => {
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
};

Modal.displayName = 'Modal';

export default Modal;
