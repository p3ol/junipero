import { ReactNode, MutableRefObject } from 'react';

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

declare interface ModalProps extends React.ComponentPropsWithRef<any> {
  apparition?: string;
  children?: ReactNode | JSX.Element;
  className?: string;
  container?: Element | DocumentFragment;
  disabled?: boolean;
  opened?: boolean;
  closable?: boolean;
  animate?(
    modal: ReactNode | JSX.Element,
    options: { opened: boolean }
  ): void;
  onToggle?(props: { opened: boolean }): void;
  ref?: MutableRefObject<ModalRef | undefined>;
}

declare function Modal(props: ModalProps): ReactNode | JSX.Element;

export default Modal;
