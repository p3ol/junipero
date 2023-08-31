import { MutableRefObject, ComponentPropsWithRef } from 'react';
import { UseClickProps, UseDismissProps, UseHoverProps, Placement } from '@floating-ui/react';
export declare type DropdownRef = {
    isJunipero: boolean;
    opened: boolean;
    toggle(): void;
    open(): void;
    close(): void;
    innerRef: MutableRefObject<any>;
};
declare interface DropdownProps extends ComponentPropsWithRef<any> {
    clickOptions?: UseClickProps;
    className?: string;
    container?: string | Element | DocumentFragment;
    disabled?: boolean;
    dismissOptions?: UseDismissProps;
    floatingOptions?: {
        middleware?: any[];
    };
    hoverOptions?: UseHoverProps;
    openend?: boolean;
    placement?: Placement;
    trigger?: 'click' | 'hover' | 'manual';
    onToggle?(props: {
        opened: boolean;
    }): void;
    ref?: MutableRefObject<DropdownRef | undefined>;
}
declare const Dropdown: import("react").ForwardRefExoticComponent<Omit<DropdownProps, "ref"> & import("react").RefAttributes<DropdownRef>>;
export default Dropdown;
