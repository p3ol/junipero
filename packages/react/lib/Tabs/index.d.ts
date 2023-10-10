import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

import { TabObject } from '../Tab';

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

declare function Tabs(props: TabsProps): ReactNode | JSX.Element;

export default Tabs;
