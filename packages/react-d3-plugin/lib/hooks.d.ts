import * as d3 from 'd3';

import { AxisObject } from './Axis';

export declare interface ChartContext {
  axis: Array<AxisObject & {
    domain: ReturnType<
      typeof d3.scaleLinear | typeof d3.scaleTime | typeof d3.scaleBand
    >
  }>;
  width: number;
  height: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  cursor: { x: number; y: number; };
}

export declare function useChart(): ChartContext;
