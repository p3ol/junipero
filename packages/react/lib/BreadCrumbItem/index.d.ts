import { ElementType } from "react";

declare interface BreadCrumbItemProps extends React.ComponentPropsWithRef<any> {
  animate?: (rendered: React.ReactNode) => React.ReactNode;
  className?: string;
  tag?: string | ElementType;
}

declare function BreadCrumbItem(props: BreadCrumbItemProps): React.ReactNode;

export default BreadCrumbItem;
