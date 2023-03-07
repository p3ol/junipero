import React, { ElementType, MutableRefObject } from 'react';

export declare type TabRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: Boolean;
};

declare interface TabProps extends React.ComponentPropsWithRef<any> {
  className?: String;
  tag?: String | ElementType;
  title?: String;
  ref?: MutableRefObject<TabRef | undefined>;
}
declare function Tab(props: TabProps): JSX.Element;

export default Tab;
