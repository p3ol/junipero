import { ComponentPropsWithRef, ElementType, MutableRefObject, ReactNode } from 'react';
import { ForwardedProps } from '../utils';
export declare type FieldAddonRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface FieldAddonProps extends ComponentPropsWithRef<any> {
    className?: string;
    children?: ReactNode | JSX.Element;
    tag?: (string | ElementType);
    ref?: MutableRefObject<FieldAddonRef | undefined>;
}
declare const FieldAddon: ForwardedProps<FieldAddonProps, FieldAddonRef>;
export default FieldAddon;
