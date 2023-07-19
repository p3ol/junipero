import {
  ReactNode,
  MutableRefObject,
  ComponentPropsWithRef,
} from 'react';

import { AxisObject } from '../Axis';

export declare type ChartRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
  axis: Array<AxisObject>;
};

declare interface ChartProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  axis: Array<AxisObject>;
  redrawThreshold?: number;
  linearDomainMaxMargin?: number;
  ref?: MutableRefObject<ChartRef | undefined>;
}

declare function Chart(props: ChartProps): ReactNode | JSX.Element;

export default Chart;
