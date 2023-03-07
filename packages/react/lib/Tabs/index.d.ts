import React, { MutableRefObject } from 'react';

export declare type TabsRef = {
  innerRef: MutableRefObject<any>;
  activeTab: number;
  isJunipero: Boolean;
};

declare interface TabsProps extends React.ComponentPropsWithRef<any> {
  className?: String;
  children?: React.ReactNode;
  active?: number;
  disabled?: Boolean;
  filterTab?: (child: React.ReactNode) => Boolean;
  onToggle?: (index: number) => void;
  ref?: MutableRefObject<TabsRef | undefined>;
}

declare function Tabs(props: TabsProps): JSX.Element;

export default Tabs;
