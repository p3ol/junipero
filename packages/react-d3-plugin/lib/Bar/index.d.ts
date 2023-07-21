import {
  ReactNode,
  MutableRefObject,
  ComponentPropsWithRef,
} from 'react';
import { TooltipProps } from '@junipero/react';

export declare type BarRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
  tooltipRef: MutableRefObject<any>;
};

declare interface BarProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  ref?: MutableRefObject<BarRef | undefined>;
  xAxisIndex: number;
  yAxisIndex: number;
  minBarWidth?: number;
  tooltip?(opts: {
    position: number | Date;
    xIndex: number;
  }): ReactNode | JSX.Element;
  tooltipProps?: TooltipProps;
}

declare function Bar(props: BarProps): ReactNode | JSX.Element;

export default Bar;
