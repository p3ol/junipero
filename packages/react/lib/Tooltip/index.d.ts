import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';
import {
  Placement,
  UseClickProps,
  UseDismissProps,
  UseHoverProps,
} from '@floating-ui/react';

export declare type TooltipRef = {
  opened: boolean;
  open(): void;
  close(): void;
  toggle(): void;
  innerRef: MutableRefObject<any>;
  handleRef: MutableRefObject<any>;
};

declare interface TooltipProps extends ComponentPropsWithRef<any> {
  apparition?: string;
  children?: ReactNode | JSX.Element;
  className?: string;
  clickOptions?: UseClickProps;
  container?: string | Element | DocumentFragment;
  disabled?: boolean;
  dismissOptions?: UseDismissProps;
  floatingOptions?: object;
  hoverOptions?: UseHoverProps;
  opened?: boolean;
  text?: string;
  placement?: Placement;
  trigger?: string;
  animate?(
    tooltipInner: ReactNode | JSX.Element,
    opts: { opened: boolean }
  ): void;
  onToggle?(props: { opened: boolean }): void;
  ref?: MutableRefObject<TooltipRef | undefined>;
}

declare function Tooltip(props: TooltipProps): ReactNode | JSX.Element;

export default Tooltip;
