import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type SliderRef = {
  isJunipero: boolean;
  moving: boolean;
  precision: number;
  value: number;
  reset: () => void;
  fillRef: MutableRefObject<any>;
  handleRef: MutableRefObject<any>;
  innerRef: MutableRefObject<any>;
  slideRef: MutableRefObject<any>;
  tooltipRef: MutableRefObject<any>;
};

declare interface SliderProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  disabled: boolean;
  max?: number;
  min?: number;
  maxValue?: number;
  minValue?: number;
  step?: number;
  tooltipEnabled?: boolean;
  value?: number;
  animateTooltip?(
    tooltip: ReactNode | JSX.Element,
    opts: { opened: boolean }
  ): ReactNode | JSX.Element;
  onMove?(value: number): void;
  parseTitle?(value: number): ReactNode | JSX.Element;
  ref?: MutableRefObject<SliderRef | undefined>;
}

declare function Slider(props: SliderProps): ReactNode | JSX.Element;

export default Slider;
