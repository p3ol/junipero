import {
  type MutableRefObject,
  type ComponentPropsWithRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';

import type { JuniperoRef } from '../types';
import type { ModalRef } from '../Modal';
import { ModalContext } from '../contexts';

export declare interface ModalControlRef extends JuniperoRef {
  close(): void;
  open(): void;
  toggle(): void;
  modalRef: MutableRefObject<ModalRef>;
}

export declare interface ModalControlProps
  extends Omit<ComponentPropsWithRef<typeof ModalContext.Provider>, 'value'> {}

const ModalControl = forwardRef<ModalControlRef, ModalControlProps>((
  props, ref,
) => {
  const modalRef = useRef<ModalRef>();

  useImperativeHandle(ref, () => ({
    modalRef,
    open,
    close,
    toggle,
    isJunipero: true,
  }));

  const open = useCallback(() => {
    modalRef.current?.open();
  }, [modalRef]);

  const close = useCallback(() => {
    modalRef.current?.close();
  }, [modalRef]);

  const toggle = useCallback(() => {
    modalRef.current?.toggle();
  }, [modalRef]);

  const setRef = useCallback((ref: ModalRef) => {
    modalRef.current = ref;
  }, [modalRef]);

  const getContext = useCallback(() => ({
    open,
    close,
    toggle,
    setRef,
  }), [open, close, toggle, setRef]);

  return (
    <ModalContext.Provider { ...props } value={getContext()} />
  );
});

ModalControl.displayName = 'ModalControl';

export default ModalControl;
