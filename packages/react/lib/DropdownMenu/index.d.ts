import { ReactNode, MutableRefObject, ComponentPropsWithRef } from 'react';

export declare type DropdownMenuRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface DropdownMenuProps extends ComponentPropsWithRef<any> {
  apparition?: string;
  children?: ReactNode | JSX.Element;
  className?: string;
  animate?(
    menu: ReactNode | JSX.Element,
    opts: { opened: boolean }
  ): ReactNode | JSX.Element;
  ref?: MutableRefObject<DropdownMenuRef | undefined>;
}

declare function DropdownMenu(props: DropdownMenuProps):
  ReactNode | JSX.Element;

export default DropdownMenu;
