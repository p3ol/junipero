import { ReactNode, MutableRefObject, ComponentPropsWithRef } from 'react';

export declare type BreadCrumbRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface BreadCrumbProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  maxItems?: number;
  filterItem?(children: ReactNode | JSX.Element): boolean;
  ref?: MutableRefObject<BreadCrumbRef | undefined>;
}

declare function BreadCrumb(props: BreadCrumbProps): ReactNode | JSX.Element;

export default BreadCrumb;
