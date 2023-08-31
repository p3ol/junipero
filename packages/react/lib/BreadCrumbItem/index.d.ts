import { ComponentPropsWithRef, ElementType, MutableRefObject, ReactNode } from 'react';
export declare type BreadCrumbItemRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface BreadCrumbItemProps extends ComponentPropsWithRef<any> {
    className?: string;
    children?: ReactNode | JSX.Element;
    tag?: string | ElementType;
    animate?(item: ReactNode | JSX.Element): ReactNode | JSX.Element;
    ref?: MutableRefObject<BreadCrumbItemRef | undefined>;
}
declare const BreadCrumbItem: import("react").ForwardRefExoticComponent<Omit<BreadCrumbItemProps, "ref"> & import("react").RefAttributes<BreadCrumbItemRef>>;
export default BreadCrumbItem;
