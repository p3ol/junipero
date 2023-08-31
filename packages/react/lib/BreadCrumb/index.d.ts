import { MutableRefObject, ComponentPropsWithRef } from 'react';
import { ForwardedProps } from '../utils';
export declare type BreadCrumbRef = {
    items: Array<JSX.Element> | Array<string>;
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
declare interface BreadCrumbProps extends ComponentPropsWithRef<any> {
    children?: JSX.Element | Array<JSX.Element>;
    className?: string;
    items?: Array<JSX.Element> | Array<string>;
    maxItems?: number;
    filterItem?(children: JSX.Element): boolean;
    ref?: MutableRefObject<BreadCrumbRef | undefined>;
}
declare const BreadCrumb: ForwardedProps<BreadCrumbProps, BreadCrumbRef>;
export default BreadCrumb;
