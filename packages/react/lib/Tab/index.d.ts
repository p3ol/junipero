import { ReactNode, MutableRefObject, ComponentPropsWithRef, ElementType } from 'react';
import { ForwardedProps } from '../utils';
export declare interface TabObject {
    title: ReactNode | JSX.Element;
    content: ReactNode | JSX.Element;
}
export declare type TabRef = {
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
export declare interface TabProps extends ComponentPropsWithRef<any> {
    className?: string;
    tag?: string | ElementType;
    title?: JSX.Element | ReactNode;
    ref?: MutableRefObject<TabRef | undefined>;
}
declare const Tab: ForwardedProps<TabProps, TabRef>;
export default Tab;
