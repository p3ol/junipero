import { ComponentPropsWithRef, MutableRefObject, ReactNode } from 'react';
import { ForwardedProps } from '../utils';
export declare type ToggleRef = {
    checked: boolean;
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
    inputRef: MutableRefObject<any>;
};
declare interface ToggleProps extends ComponentPropsWithRef<any> {
    checked?: boolean;
    children?: ReactNode | JSX.Element;
    className?: string;
    disabled?: boolean;
    tabIndex?: number;
    value?: any;
    onChange?(field: {
        value: any;
        checked: boolean;
    }): void;
    ref?: MutableRefObject<ToggleRef | undefined>;
}
declare const Toggle: ForwardedProps<ToggleProps, ToggleRef>;
export default Toggle;
