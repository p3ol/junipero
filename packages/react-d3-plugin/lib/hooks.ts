import * as d3 from 'd3';
import { useContext } from 'react';

import { AxisObject } from './Axis';
import { ChartContext } from './contexts';

export declare interface ChartContextType {
  axis?: Array<AxisObject & {
    domain: ReturnType<
      typeof d3.scaleLinear | typeof d3.scaleTime | typeof d3.scaleBand
    >
  }>;
  width?: number;
  height?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  cursor?: { x: number; y: number; };
}

export const useChart = () => useContext<ChartContextType>(ChartContext);
