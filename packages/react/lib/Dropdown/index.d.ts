import { ReactNode, MutableRefObject, ComponentPropsWithRef } from 'react';
import {
  Placement,
  UseClickProps,
  UseDismissProps,
  UseHoverProps,
} from '@floating-ui/react';

export declare type DropdownRef = {
  isJunipero: boolean;
  opened: boolean;
  toggle(): void;
  open(): void;
  close(): void;
  innerRef: MutableRefObject<any>;
};

declare interface DropdownProps extends ComponentPropsWithRef<any> {
  clickOptions?: UseClickProps;
  className?: string;
  container?: string | Element | DocumentFragment;
  disabled?: boolean;
  dismissOptions?: UseDismissProps;
  floatingOptions?: object;
  hoverOptions?: UseHoverProps;
  openend?: boolean;
  placement?: Placement;
  trigger?: 'click' | 'hover' | 'manual';
  onToggle?(props: { opened: boolean }): void;
  ref?: MutableRefObject<DropdownRef | undefined>;
}

declare function Dropdown(props: DropdownProps): ReactNode | JSX.Element;

export default Dropdown;
