import { ReactNode, ComponentPropsWithoutRef } from 'react';

export declare interface DropdownGroupProps
  extends ComponentPropsWithoutRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  title?: ReactNode | JSX.Element;
}

declare function DropdownGroup(props: DropdownGroupProps):
  ReactNode | JSX.Element;

export default DropdownGroup;
