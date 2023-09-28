import { ReactNode, ComponentPropsWithRef } from 'react';

export declare interface TransitionProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  in: boolean;
  mounterOnEnter?: boolean;
  name?: string;
  timeout?: number | { enter: number; exit: number };
  unmountOnExit?: boolean;
  onEnter?(): void;
  onEntering?(): void;
  onEntered?(): void;
  onExit?(): void;
  onExiting?(): void;
  onExited?(): void;
}

declare function Transition(props: TransitionProps): ReactNode | JSX.Element;

export default Transition;
