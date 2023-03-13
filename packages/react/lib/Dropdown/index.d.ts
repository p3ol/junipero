import { Placement } from '@floating-ui/react';
import {
  Props as ClickProps,
} from '@floating-ui/react/src/hooks/useClick';
import {
  Props as DismissProps,
} from '@floating-ui/react/src/hooks/useDismiss';
import {
  Props as HoverProps,
} from '@floating-ui/react/src/hooks/useHover';
import { ReactNode, MutableRefObject } from 'react';

export declare type DropdownRef = {
  isJunipero: boolean;
  opened: boolean;
  toggle(): void;
  open(): void;
  close(): void;
  innerRef: MutableRefObject<any>;
};

declare interface DropdownProps extends React.ComponentPropsWithRef<any> {
  clickOptions?: ClickProps;
  className?: string;
  container?: Element | DocumentFragment;
  disabled?: boolean;
  dismissOptions?: DismissProps;
  floatingOptions?: object;
  hoverOptions?: HoverProps;
  openend?: boolean;
  placement?: Placement;
  trigger?: 'click' | 'hover' | 'manual';
  onToggle?(props: { opened: boolean }): void;
  ref?: MutableRefObject<DropdownRef | undefined>;
}

declare function Dropdown(props: DropdownProps): ReactNode | JSX.Element;

export default Dropdown;
