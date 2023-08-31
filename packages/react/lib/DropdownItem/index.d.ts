import { ComponentPropsWithoutRef, ReactNode } from 'react';
declare interface DropdownItemProps extends ComponentPropsWithoutRef<any> {
    children?: ReactNode | JSX.Element;
    className?: string;
}
declare const DropdownItem: {
    ({ className, ...rest }: DropdownItemProps): import("react").JSX.Element;
    displayName: string;
};
export default DropdownItem;
