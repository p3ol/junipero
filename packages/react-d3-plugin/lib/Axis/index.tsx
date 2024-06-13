import {
  type MutableRefObject,
  type ComponentPropsWithRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { type JuniperoRef, classNames } from '@junipero/react';
import * as d3 from 'd3';

import { useChart } from '../hooks';
import { getAxisType } from '../utils';

export declare type AxisDataType = Array<
  | string
  | number
  | Date
  | {[key: string]: number}
  | [number, number]
  | Iterable<[number, number]>
>;

export declare interface AxisObject<T = AxisDataType> {
  type: typeof d3.axisLeft | typeof d3.axisBottom | typeof d3.axisRight |
    typeof d3.axisTop;
  scale: typeof d3.scaleLinear | typeof d3.scaleTime | typeof d3.scaleBand;
  data: T;
  range?: d3.ScaleContinuousNumeric<number, number> |
    d3.ScaleLinear<number, number> |
    d3.ScaleTime<number, number> |
    d3.ScaleBand<number | Date>;
  domain?: ReturnType<
    typeof d3.scaleLinear | typeof d3.scaleTime | typeof d3.scaleBand
  >;
  min?: number | Date;
  max?: number | Date;
  parseTitle?(value: number | Date, opts: object): string;
  findSelectionIndex?(
    position: number | Date,
    data?: Array<number | Date>
  ): number;
  ticks?: number;
  tickSize?: number;
  grid?: boolean;
  stackKeys?: Array<string>;
}

export declare interface AxisRef extends JuniperoRef {
  innerRef: MutableRefObject<SVGGElement>;
  gridRef: MutableRefObject<SVGGElement>;
  ticksRef: MutableRefObject<SVGGElement>;
}

export declare interface AxisProps extends ComponentPropsWithRef<'g'> {
  axis: AxisObject;
}

const Axis = forwardRef<AxisRef, AxisProps>(({
  className,
  axis,
  ...rest
}, ref) => {
  const innerRef = useRef<SVGGElement>();
  const ticksRef = useRef<SVGGElement>();
  const gridRef = useRef<SVGGElement>();
  const {
    width,
    height,
    paddingRight,
    paddingTop,
    paddingBottom,
    paddingLeft,
  } = useChart();

  useImperativeHandle(ref, () => ({
    innerRef,
    gridRef,
    ticksRef,
    isJunipero: true,
  }));

  const shift = useMemo(() => {
    if (!axis) {
      return [0, 0];
    }

    switch (axis.type) {
      case d3.axisLeft: return [0, 0];
      case d3.axisRight: return [width - paddingRight - paddingLeft, 0];
      case d3.axisTop: return [0, 0];
      default: return [-paddingLeft, height - paddingTop - paddingBottom];
    }
  }, [
    axis?.type,
    width,
    height,
    paddingRight,
    paddingTop,
    paddingBottom,
    paddingLeft,
  ]);

  useEffect(() => {
    if (!axis) {
      return;
    }

    d3
      .select(ticksRef.current)
      .call(axis.type(axis.range)
        .ticks(axis.ticks ?? 5)
        .tickSize(axis.tickSize ?? 5)
        .tickFormat((d: Date | number) => (
          axis.parseTitle || ((v, ...args) => v.toString())
        )?.(d, { type: 'tick', axis })) as any,
      )
      .call(g => g.select('.domain').remove());

    if (axis.grid) {
      d3
        .select(gridRef.current)
        .call(axis.type(axis.range)
          .ticks(axis.ticks ?? 5)
          .tickSize(-(width - paddingLeft - paddingRight))
          .tickFormat((d: Date | number) => '') as any,
        )
        .call(g => g.select('.domain').remove());
    }
  }, [
    axis?.type,
    axis?.range,
    axis?.ticks,
    axis?.tickSize,
    axis?.grid,
    axis?.parseTitle,
    width,
    paddingRight,
  ]);

  return (
    <g
      className={classNames(
        'junipero axis',
        { [getAxisType(axis?.type)]: !!axis?.type },
        className
      )}
      ref={innerRef}
      { ...rest }
    >
      <g
        ref={ticksRef}
        className="junipero extra ticks"
        transform={`translate(${shift[0]}, ${shift[1]})`}
      />

      { axis?.grid && (
        <g ref={gridRef} className="grid" />
      ) }
    </g>
  );
});

Axis.displayName = 'Axis';

export default Axis;
