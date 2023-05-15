import {
  ReactNode,
  ComponentPropsWithRef,
  ElementType,
  MutableRefObject,
} from 'react';

export declare interface TabObject {
  title: ReactNode | JSX.Element;
  content: ReactNode | JSX.Element;
}

export declare type TabRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface TabProps extends ComponentPropsWithRef<any> {
  className?: string;
  tag?: string | ElementType;
  title?: string;
  ref?: MutableRefObject<TabRef | undefined>;
}
declare function Tab(props: TabProps): ReactNode | JSX.Element;

export default Tab;
