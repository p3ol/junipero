import React, { MutableRefObject } from 'react';

export declare type ModalRef = {
  opened: Boolean;
  innerRef: MutableRefObject<any>;
  contentRef: MutableRefObject<any>;
  wrapperRef: MutableRefObject<any>;
  closeButtonRef: MutableRefObject<any>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  isJunipero: Boolean;
};

declare interface ModalProps extends React.ComponentPropsWithRef<any> {
  animate?: (
    modal: React.ReactNode,
    options: { opened?: Boolean }
  ) => void;
  apparition?: String;
  children?: React.ReactNode;
  className?: String;
  container?: Node | String;
  disabled?: Boolean;
  opened?: Boolean;
  closable?: Boolean;
  onToggle?: (props: { opened?: Boolean }) => void;
  ref?: MutableRefObject<ModalRef | undefined>;
}

declare function Modal(props: ModalProps): JSX.Element;

export default Modal;
