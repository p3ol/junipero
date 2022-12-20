import React, { ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type SliderRef = {
  innerRef: MutableRefObject<any>;
  fillRef: MutableRefObject<any>;
  slideRef: MutableRefObject<any>;
  handleRef: MutableRefObject<any>;
  tooltipRef: MutableRefObject<any>;
  value: Number;
  moving: Boolean;
  precision: Number;
  reset: () => void;
  isJunipero: Boolean;
};

declare interface SliderProps extends ComponentPropsWithRef<any> {
  children?: React.ReactNode;
  className?: String;
  value?: Number;
  max?: Number;
  min?: Number;
  maxValue?: Number;
  minValue?: Number;
  step?: Number;
  tooltipEnabled?: Boolean;
  disabled: Boolean;
  onMove?: (value: Number) => void;
  parseTitle?: (value: Number) => React.ReactNode;
  animateTooltip?: (tooltip: JSX.Element, opts: { opened: Boolean }) =>
    JSX.Element;
  ref?: MutableRefObject<SliderRef | undefined>;
}

declare function Slider(props: SliderProps): JSX.Element;

export default Slider;
