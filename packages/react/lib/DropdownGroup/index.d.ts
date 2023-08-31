import { ComponentPropsWithoutRef, ReactNode } from 'react';
declare interface DropdownGroupProps extends ComponentPropsWithoutRef<any> {
    children?: JSX.Element | ReactNode;
    className?: string;
    title?: ReactNode | JSX.Element;
}
declare const DropdownGroup: {
    ({ children, title, className }: DropdownGroupProps): import("react").JSX.Element;
    displayName: string;
    propTypes: {
        title: any;
    };
};
export default DropdownGroup;
