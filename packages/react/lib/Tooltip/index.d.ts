import { Placement } from '@floating-ui/react-dom-interactions';
import {
  Props as clickProps,
} from '@floating-ui/react-dom-interactions/src/hooks/useClick';
import {
  Props as dismissProps,
} from '@floating-ui/react-dom-interactions/src/hooks/useDismiss';
import {
  Props as hoverProps,
} from '@floating-ui/react-dom-interactions/src/hooks/useHover';
import React, { MutableRefObject } from 'react';

export declare type TooltipRef = {
  onpened: Boolean;
  innerRef: MutableRefObject<any>;
  handleRef: MutableRefObject<any>;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

declare interface TooltipProps extends React.ComponentPropsWithRef<any> {
  animate?: (
    tooltipInner: React.ReactNode,
    options: { opened?: Boolean }
  ) => void;
  apparition?: String;
  children?: React.ReactNode;
  className?: String;
  clickOptions?: clickProps;
  container?: React.ReactNode;
  disabled?: Boolean;
  dismissOptions?: dismissProps;
  floatingOptions?: Object;
  hoverOptions?: hoverProps;
  opened?: Boolean;
  text?: String;
  placement?: Placement;
  trigger?: String;
  onToggle?: (props: { opened?: Boolean }) => void;
  ref?: MutableRefObject<TooltipRef | undefined>;
}

declare function Tooltip(props: TooltipProps): JSX.Element;

export default Tooltip;
