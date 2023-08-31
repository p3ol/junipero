import { ComponentPropsWithRef, ElementType, MutableRefObject, ReactNode } from 'react';
import { ForwardedProps } from '../utils';
export declare type BadgeRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface BadgeProps extends ComponentPropsWithRef<any> {
    children?: ReactNode | JSX.Element;
    className?: string;
    tag?: string | ElementType;
    ref?: MutableRefObject<BadgeRef>;
}
declare const Badge: ForwardedProps<BadgeProps, BadgeRef>;
export default Badge;
