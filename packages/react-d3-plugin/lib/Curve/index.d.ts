import {
  ReactNode,
  MutableRefObject,
  ComponentPropsWithRef,
} from 'react';
import * as d3 from 'd3';

export declare type CurveRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
  defsRef: MutableRefObject<any>;
  lineRef: MutableRefObject<any>;
  areaRef: MutableRefObject<any>;
};

declare interface CurveProps extends ComponentPropsWithRef<any> {
  children?: ReactNode | JSX.Element;
  className?: string;
  ref?: MutableRefObject<CurveRef | undefined>;
  serie?: Array<number | Date>;
  type?: 'line' | 'area';
  curve?: d3.CurveFactory;
  xAxisIndex: number;
  yAxisIndex: number;
  lineCapShift?: number;
}

declare function Curve(props: CurveProps): ReactNode | JSX.Element;

export default Curve;
