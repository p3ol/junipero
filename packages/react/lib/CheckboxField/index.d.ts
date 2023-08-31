import { MutableRefObject, ReactNode, ComponentPropsWithRef } from 'react';
export declare type CheckboxFieldRef = {
    checked: boolean;
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
    inputRef: MutableRefObject<any>;
};
declare interface CheckboxFieldProps extends ComponentPropsWithRef<any> {
    checked?: boolean;
    children?: ReactNode | JSX.Element;
    className?: string;
    disabled?: boolean;
    id?: string;
    name?: string;
    required?: boolean;
    valid?: boolean;
    value?: any;
    onChange?(changeEvent: {
        value: any;
        checked: boolean;
    }): void;
    onValidate?(value: any, { dirty, required }: {
        dirty?: boolean;
        required?: boolean;
    }): boolean;
    ref?: MutableRefObject<CheckboxFieldRef | undefined>;
}
declare const CheckboxField: import("react").ForwardRefExoticComponent<Omit<CheckboxFieldProps, "ref"> & import("react").RefAttributes<CheckboxFieldRef>>;
export default CheckboxField;
