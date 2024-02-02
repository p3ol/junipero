import { forwardRef, useCallback, useImperativeHandle, useRef, ReactNode, MutableRefObject, ComponentPropsWithoutRef } from 'react';

import { ModalContext } from '../contexts';
import { ModalRef } from '../Modal';

export declare type ModalControlRef = {
  isJunipero: boolean;
  close(): void;
  open(): void;
  toggle(): void;
  modalRef: MutableRefObject<ModalRef>;
};

export declare interface ModalControlProps
  extends ComponentPropsWithoutRef<any> {
  children?: ReactNode | JSX.Element;
  ref?: MutableRefObject<ModalControlRef | undefined>;
}

const ModalControl = forwardRef(({ children }: ModalControlProps, ref) => {
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
    <ModalContext.Provider value={getContext()}>
      { children }
    </ModalContext.Provider>
  );
});

ModalControl.displayName = 'ModalControl';

export default ModalControl;
