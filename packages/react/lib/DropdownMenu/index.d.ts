import { MutableRefObject } from "react";

export declare type DropdownMenuRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: Boolean;
};

declare interface DropdownMenuProps extends React.ComponentPropsWithRef<any> {
  children?: React.ReactNode;
  className?: String;
  ref?: MutableRefObject<DropdownMenuRef | undefined>;
}

declare function DropdownMenu(props: DropdownMenuProps): JSX.Element;

export default DropdownMenu;
