import { MutableRefObject } from "react";

export declare type BreadCrumbRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: Boolean;
};

declare interface BreadCrumbProps extends React.ComponentPropsWithRef<any> {
  className?: string;
  children?: React.ReactNode;
  maxItems?: number;
  filterItem?: (children: React.ReactNode) => boolean;
  ref?: MutableRefObject<BreadCrumbRef | undefined>;
}

declare function BreadCrumb(props: BreadCrumbProps): JSX.Element;

export default BreadCrumb;
