import { MutableRefObject } from 'react';

export declare type DropdownMenuRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: Boolean;
};

declare interface DropdownMenuProps extends React.ComponentPropsWithRef<any> {
  animate: (menu: JSX.Element, opts: { opened: Boolean }) => JSX.Element;
  apparition: String;
  children?: React.ReactNode;
  className?: String;
  ref?: MutableRefObject<DropdownMenuRef | undefined>;
}

declare function DropdownMenu(props: DropdownMenuProps): JSX.Element;

export default DropdownMenu;
