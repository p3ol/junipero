import { MutableRefObject, ComponentPropsWithRef, ReactNode } from 'react';

export declare type DropdownToggleRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface DropdownToggleProps
  extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  ref?: MutableRefObject<DropdownToggleRef | undefined>;
}

declare function DropdownToggle(props: DropdownToggleProps):
  ReactNode | JSX.Element;

export default DropdownToggle;
