import {
  ReactNode,
  MutableRefObject,
  ComponentPropsWithRef,
} from 'react';
import { TooltipProps } from '@junipero/react';

export declare type MarkerRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
  tooltipRef: MutableRefObject<any>;
  position: number | Date;
  xIndex: number;
  x: number;
  y: number;
};

declare interface MarkerProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  ref?: MutableRefObject<MarkerRef | undefined>;
  series?: Array<Array<number | Date>> | Array<number | Date>;
  xAxisIndex?: number;
  yAxisIndexes?: Array<number>;
  tooltip?(opts: {
    position: number | Date;
    xIndex: number;
  }): ReactNode | JSX.Element;
  tooltipProps?: TooltipProps;
}

declare function Marker(props: MarkerProps): ReactNode | JSX.Element;

export default Marker;
