import { MutableRefObject, ComponentPropsWithRef } from 'react';
export declare type CodeFieldRef = {
    dirty: boolean;
    isJunipero: boolean;
    valid: boolean;
    value: string;
    focus(index: number): void;
    blur(index: number): void;
    reset(): void;
    innerRef: MutableRefObject<any>;
    inputsRef: MutableRefObject<Array<any>>;
};
declare interface CodeFieldProps extends ComponentPropsWithRef<any> {
    autoFocus?: boolean;
    disabled?: boolean;
    className?: string;
    id?: string;
    name?: string;
    required?: boolean;
    size?: number;
    valid?: boolean;
    value?: string;
    onValidate?(value: string, { dirty, required }: {
        dirty?: boolean;
        required?: boolean;
    }): boolean;
    onChange?(changeProps: {
        value?: string;
        valid: boolean;
    }): void;
    onPaste?(e: Event): void;
    onFocus?(e: Event): void;
    onBlur?(e: Event): void;
    ref?: MutableRefObject<CodeFieldRef | undefined>;
}
declare const CodeField: import("react").ForwardRefExoticComponent<Omit<CodeFieldProps, "ref"> & import("react").RefAttributes<CodeFieldRef>>;
export default CodeField;
