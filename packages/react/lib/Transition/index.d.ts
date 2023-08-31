import { ComponentPropsWithRef } from 'react';
declare type TimeoutObject = {
    enter?: number;
    exit?: number;
};
declare interface TransitionProps extends ComponentPropsWithRef<any> {
    children?: JSX.Element;
    in: boolean;
    mounterOnEnter?: boolean;
    name?: string;
    timeout?: number | TimeoutObject;
    unmountOnExit?: boolean;
    onEnter?(): void;
    onEntering?(): void;
    onEntered?(): void;
    onExit?(): void;
    onExiting?(): void;
    onExited?(): void;
}
declare const Transition: {
    ({ children, in: inProp, name, timeout, mountOnEnter, unmountOnExit, onEnter, onEntering, onEntered, onExit, onExiting, onExited, ...rest }: TransitionProps): import("react").FunctionComponentElement<any>;
    displayName: string;
    propTypes: {
        in: any;
        name: any;
        timeout: any;
        mountOnEnter: any;
        unmountOnExit: any;
        onEnter: any;
        onEntering: any;
        onEntered: any;
        onExit: any;
        onExiting: any;
        onExited: any;
    };
};
export default Transition;
