import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';
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
  clickOptions?: ClickProps;
  container?: Element | DocumentFragment;
  disabled?: boolean;
  dismissOptions?: DismissProps;
  floatingOptions?: object;
  hoverOptions?: HoverProps;
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
