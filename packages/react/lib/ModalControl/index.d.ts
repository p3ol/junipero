import { ReactNode, MutableRefObject, ComponentPropsWithoutRef } from 'react';

export declare type ModalControlRef = {
  isJunipero: boolean;
  close(): void;
  open(): void;
  toggle(): void;
  modalRef: MutableRefObject<any>;
};

export declare interface ModalControlProps
  extends ComponentPropsWithoutRef<any> {
  children?: ReactNode | JSX.Element;
  ref?: MutableRefObject<ModalControlRef | undefined>;
}

declare function ModalControl(props: ModalControlProps):
  ReactNode | JSX.Element;

export default ModalControl;
