import { ReactNode, ComponentPropsWithoutRef } from 'react';

declare interface DropdownItemProps extends ComponentPropsWithoutRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
}

declare function DropdownItem(props: DropdownItemProps):
  ReactNode | JSX.Element;

export default DropdownItem;
