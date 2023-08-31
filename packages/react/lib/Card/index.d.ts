import { ComponentPropsWithRef, ElementType, MutableRefObject, ReactNode } from 'react';
export declare type CardRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface CardProps extends ComponentPropsWithRef<any> {
    children?: ReactNode | JSX.Element;
    className?: string;
    tag?: string | ElementType;
    ref?: MutableRefObject<CardRef | undefined>;
}
declare const Card: import("react").ForwardRefExoticComponent<Omit<CardProps, "ref"> & import("react").RefAttributes<CardRef>>;
export default Card;
