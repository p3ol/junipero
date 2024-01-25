import {
  ReactNode,
  MutableRefObject,
  ComponentPropsWithRef,
} from 'react';
import * as d3 from 'd3';

export declare interface AxisObject {
  type: d3.Axis<d3.AxisDomain>;
  scale: d3.ScaleLinear<number, number, never> |
    d3.ScaleTime<number, number, never> |
    d3.ScaleBand<string>;
  range: d3.ScaleContinuousNumeric<number, number, never> |
    d3.ScaleTime<number, number, never>;
  data: Array<number | Date | object>;
  min?: number | Date;
  max?: number | Date;
  parseTitle?(value: number | Date): string;
  findSelectionIndex?(
    position: number | Date,
    data: Array<number | Date>
  ): number;
  ticks?: number;
  tickSize?: number;
  grid?: boolean;
  stackKeys?: Array<string>;
}

export declare type AxisRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
  gridRef: MutableRefObject<any>;
};

export declare interface AxisProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  axis: AxisObject;
  ref?: MutableRefObject<AxisRef | undefined>;
}

declare function Axis(props: AxisProps): ReactNode | JSX.Element;

export default Axis;
