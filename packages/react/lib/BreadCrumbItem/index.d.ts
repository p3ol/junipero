import { ElementType, MutableRefObject } from "react";

export declare type BreadCrumbItemRef = {};
declare interface BreadCrumbItemProps extends React.ComponentPropsWithRef<any> {
  animate?: (rendered: React.ReactNode) => React.ReactNode;
  className?: string;
  tag?: string | ElementType;
  ref?: MutableRefObject<BreadCrumbItemRef | undefined>;
}

declare function BreadCrumbItem(props: BreadCrumbItemProps): JSX.Element;

export default BreadCrumbItem;
