import { createContext } from 'react';

import type { AxisObject } from './Axis';

export declare interface ChartContextType {
  axis?: Array<AxisObject>;
  width?: number;
  height?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  cursor?: { x: number, y: number };
}

export const ChartContext = createContext<ChartContextType>({});
