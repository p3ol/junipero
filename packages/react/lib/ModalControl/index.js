import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import { ModalContext } from '../contexts';

const ModalControl = forwardRef(({ children }, ref) => {
  const modalRef = useRef();

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

  const setRef = useCallback(r => {
    modalRef.current = r;
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
