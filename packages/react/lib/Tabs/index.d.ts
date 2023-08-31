import { MutableRefObject, ComponentPropsWithRef, ReactNode } from 'react';
import { TabObject } from '../Tab';
import { ForwardedProps } from '../utils';
export declare type TabsRef = {
    activeTab: number;
    tabs: Array<TabObject>;
    isJunipero: boolean;
    innerRef: MutableRefObject<any>;
};
export declare interface TabsProps extends ComponentPropsWithRef<any> {
    active?: number;
    children?: ReactNode | JSX.Element;
    className?: string;
    disabled?: boolean;
    tabs?: Array<TabObject>;
    filterTab?(child: ReactNode | JSX.Element): boolean;
    onToggle?(index: number): void;
    ref?: MutableRefObject<TabsRef | undefined>;
}
declare const Tabs: ForwardedProps<TabsProps, TabsRef>;
export default Tabs;
