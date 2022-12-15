import React from 'react';

declare interface TransitionProps extends React.ComponentPropsWithRef<any> {
  children?: string | React.ReactNode | Function;
  in?: Boolean;
  name?: String;
  timeout?: Number;
  mounterOnEnter?: Boolean;
  unmountOnExit?: Boolean;
}

declare function Transition(props: TransitionProps): JSX.Element;

export default Transition;
