import { ComponentPropsWithRef, ElementType, MutableRefObject, ReactNode } from 'react';
export declare type ButtonRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface ButtonProps extends ComponentPropsWithRef<any> {
    className?: string;
    children?: ReactNode | JSX.Element;
    disabled?: boolean;
    tag?: string | ElementType;
    onClick?(e: Event): void;
    ref?: MutableRefObject<ButtonRef | undefined>;
}
declare const Button: import("react").ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & import("react").RefAttributes<ButtonRef>>;
export default Button;
