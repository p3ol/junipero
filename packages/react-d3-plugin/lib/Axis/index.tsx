import {
  type RefObject,
  useImperativeHandle,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import {
  type JuniperoRef,
  type SpecialComponentPropsWithRef,
  classNames,
} from '@junipero/react';
import * as d3 from 'd3';

import { getAxisType, getAxisFunction } from '../utils';
import { useChart } from '../hooks';

export declare type AxisDataType = (
  | string
  | number
  | Date
  | Record<string, number>
  | [number, number]
  | Iterable<[number, number]>
)[];

export declare interface AxisObject<T = AxisDataType> {
  type: 'axisTop' | 'axisRight' | 'axisBottom' | 'axisLeft';
  scale: 'scaleLinear' | 'scaleTime' | 'scaleBand';
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
    data?: (number | Date)[]
  ): number;
  ticks?: number;
  tickSize?: number;
  grid?: boolean;
  stackKeys?: string[];
}

export declare interface AxisRef extends JuniperoRef {
  innerRef: RefObject<SVGGElement>;
  gridRef: RefObject<SVGGElement>;
  ticksRef: RefObject<SVGGElement>;
}

export declare interface AxisProps
  extends SpecialComponentPropsWithRef<'g', AxisRef> {
  axis: AxisObject;
}

const Axis = ({
  ref,
  className,
  axis,
  ...rest
}: AxisProps) => {
  const innerRef = useRef<SVGGElement>(null);
  const ticksRef = useRef<SVGGElement>(null);
  const gridRef = useRef<SVGGElement>(null);
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
      case 'axisLeft': return [0, 0];
      case 'axisRight': return [width - paddingRight - paddingLeft, 0];
      case 'axisTop': return [0, 0];
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
      .call(getAxisFunction(axis.type)(axis.range)
        .ticks(axis.ticks ?? 5)
        .tickSize(axis.tickSize ?? 5)
        .tickFormat((d: Date | number) => (
          axis.parseTitle || (v => v.toString())
        )?.(d, { type: 'tick', axis })) as any,
      )
      .call(g => g.select('.domain').remove());

    if (axis.grid) {
      d3
        .select(gridRef.current)
        .call(getAxisFunction(axis.type)(axis.range)
          .ticks(axis.ticks ?? 5)
          .tickSize(-(width - paddingLeft - paddingRight))
          .tickFormat(() => '') as any,
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
};

Axis.displayName = 'Axis';

export default Axis;
