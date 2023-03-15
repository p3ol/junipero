import { ReactNode, MutableRefObject, ComponentPropsWithRef } from 'react';

export declare type BreadCrumbRef = {
  items: Array<ReactNode | JSX.Element>;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface BreadCrumbProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  items?: Array<ReactNode | JSX.Element>;
  maxItems?: number;
  filterItem?(children: ReactNode | JSX.Element): boolean;
  ref?: MutableRefObject<BreadCrumbRef | undefined>;
}

declare function BreadCrumb(props: BreadCrumbProps): ReactNode | JSX.Element;

export default BreadCrumb;
