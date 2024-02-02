import { AxisObject } from './Axis';

export declare interface ChartContext {
  axis: Array<AxisObject>;
  width: number;
  height: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  cursor: { x: number; y: number; };
}

export declare function useChart(): ChartContext;
