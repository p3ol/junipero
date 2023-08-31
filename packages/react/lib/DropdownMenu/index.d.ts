import { ComponentPropsWithRef, MutableRefObject, ReactNode } from 'react';
export declare type DropdownMenuRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface DropdownMenuProps extends ComponentPropsWithRef<any> {
    apparition?: string;
    children?: ReactNode | JSX.Element;
    className?: string;
    animate?(menu: ReactNode | JSX.Element, opts: {
        opened: boolean;
        onExited: (opened: boolean) => void;
    }): ReactNode | JSX.Element;
    ref?: MutableRefObject<DropdownMenuRef | undefined>;
}
declare const DropdownMenu: import("react").ForwardRefExoticComponent<Omit<DropdownMenuProps, "ref"> & import("react").RefAttributes<unknown>>;
export default DropdownMenu;
