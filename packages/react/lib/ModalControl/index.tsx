import {
  type RefObject,
  type ComponentPropsWithoutRef,
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
  modalRef: RefObject<ModalRef>;
}

export declare interface ModalControlProps extends Omit<
  ComponentPropsWithoutRef<typeof ModalContext.Provider>, 'value'
> {
  ref?: RefObject<ModalControlRef>;
}

const ModalControl = ({
  ref,
  ...rest
}: ModalControlProps) => {
  const modalRef = useRef<ModalRef>(null);

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
    <ModalContext.Provider { ...rest } value={getContext()} />
  );
};

ModalControl.displayName = 'ModalControl';

export default ModalControl;
