import { MutableRefObject, ComponentPropsWithRef } from 'react';
export declare type DropdownToggleRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface DropdownToggleProps extends ComponentPropsWithRef<any> {
    children?: JSX.Element;
    ref?: MutableRefObject<DropdownToggleRef | undefined>;
}
declare const DropdownToggle: import("react").ForwardRefExoticComponent<Omit<DropdownToggleProps, "ref"> & import("react").RefAttributes<DropdownToggleRef>>;
export default DropdownToggle;
