import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type TabsRef = {
  activeTab: number;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface TabsProps extends ComponentPropsWithRef<any> {
  active?: number;
  children?: ReactNode | JSX.Element;
  className?: string;
  disabled?: boolean;
  filterTab?(child: ReactNode | JSX.Element): boolean;
  onToggle?(index: number): void;
  ref?: MutableRefObject<TabsRef | undefined>;
}

declare function Tabs(props: TabsProps): ReactNode | JSX.Element;

export default Tabs;
