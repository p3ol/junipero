import { ReactNode, ElementType, MutableRefObject } from 'react';

export declare type BreadCrumbItemRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface BreadCrumbItemProps extends React.ComponentPropsWithRef<any> {
  className?: string;
  children?: ReactNode | JSX.Element;
  tag?: string | ElementType;
  animate?(rendered: ReactNode | JSX.Element): ReactNode | JSX.Element;
  ref?: MutableRefObject<BreadCrumbItemRef | undefined>;
}

declare function BreadCrumbItem(props: BreadCrumbItemProps):
  ReactNode | JSX.Element;

export default BreadCrumbItem;
