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

export declare type DropdownRef = {
  opened: Boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  isJunipero: Boolean;
  innerRef: MutableRefObject<any>;
};

declare interface DropdownProps extends React.ComponentPropsWithRef<any> {
  className?: String;
  container?: String | React.ReactNode;
  floatingOptions?: Object;
  clickOptions?: clickProps;
  hoverOptions?: hoverProps;
  dismissOptions?: dismissProps;
  openend?: Boolean;
  placement?: Placement;
  trigger?: 'click' | 'hover' | 'manual';
  onToggle?: (props: { opened: Boolean }) => void;
  disabled?: Boolean;
  ref?: MutableRefObject<DropdownRef | undefined>;
}

declare function Dropdown(props: DropdownProps): JSX.Element;

export default Dropdown;
